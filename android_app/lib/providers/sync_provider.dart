import 'package:flutter/material.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'dart:convert';
import '../utils/constants.dart';

class SyncProvider extends ChangeNotifier {
  final SupabaseClient _supabase = Supabase.instance.client;
  WebSocketChannel? _channel;
  
  bool _isConnected = false;
  bool _isConnecting = false;
  Map<String, dynamic> _syncData = {};
  List<Map<String, dynamic>> _queuedMessages = [];
  String? _deviceId;
  String? _linkedDeviceId;

  // Getters
  bool get isConnected => _isConnected;
  bool get isConnecting => _isConnecting;
  Map<String, dynamic> get syncData => _syncData;
  String? get deviceId => _deviceId;
  String? get linkedDeviceId => _linkedDeviceId;
  bool get isLinked => _linkedDeviceId != null;

  SyncProvider() {
    _initializeSync();
  }

  void _initializeSync() {
    _generateDeviceId();
    _connectWebSocket();
    _listenToSupabaseChanges();
  }

  void _generateDeviceId() {
    // Generate unique device ID
    _deviceId = 'mobile_${DateTime.now().millisecondsSinceEpoch}';
  }

  Future<void> _connectWebSocket() async {
    if (_isConnecting || _isConnected) return;
    
    try {
      _isConnecting = true;
      notifyListeners();
      
      _channel = WebSocketChannel.connect(
        Uri.parse(AppConstants.websocketUrl),
      );
      
      _channel!.stream.listen(
        _handleWebSocketMessage,
        onDone: _handleWebSocketDisconnect,
        onError: _handleWebSocketError,
      );
      
      _isConnected = true;
      _isConnecting = false;
      
      // Send device registration
      _sendMessage({
        'type': 'register',
        'deviceId': _deviceId,
        'platform': 'mobile',
        'timestamp': DateTime.now().toIso8601String(),
      });
      
      // Send queued messages
      for (final message in _queuedMessages) {
        _sendMessage(message);
      }
      _queuedMessages.clear();
      
      notifyListeners();
    } catch (error) {
      _isConnected = false;
      _isConnecting = false;
      notifyListeners();
      
      // Retry connection after delay
      Future.delayed(const Duration(seconds: 5), _connectWebSocket);
    }
  }

  void _handleWebSocketMessage(dynamic message) {
    try {
      final data = jsonDecode(message.toString());
      
      switch (data['type']) {
        case 'sync_data':
          _updateSyncData(data['payload']);
          break;
        case 'device_linked':
          _linkedDeviceId = data['linkedDeviceId'];
          notifyListeners();
          break;
        case 'qr_scan_result':
          _handleQRScanResult(data);
          break;
        case 'agent_update':
          _handleAgentUpdate(data['payload']);
          break;
        case 'ping':
          _sendMessage({'type': 'pong', 'deviceId': _deviceId});
          break;
      }
    } catch (error) {
      debugPrint('Error handling WebSocket message: $error');
    }
  }

  void _handleWebSocketDisconnect() {
    _isConnected = false;
    notifyListeners();
    
    // Attempt to reconnect
    Future.delayed(const Duration(seconds: 3), _connectWebSocket);
  }

  void _handleWebSocketError(error) {
    debugPrint('WebSocket error: $error');
    _isConnected = false;
    notifyListeners();
  }

  void _sendMessage(Map<String, dynamic> message) {
    if (_isConnected && _channel != null) {
      try {
        _channel!.sink.add(jsonEncode(message));
      } catch (error) {
        _queuedMessages.add(message);
      }
    } else {
      _queuedMessages.add(message);
    }
  }

  void _listenToSupabaseChanges() {
    // Listen to real-time changes in Supabase
    _supabase
        .channel('public:sync_data')
        .onPostgresChanges(
          event: PostgresChangeEvent.all,
          schema: 'public',
          table: 'sync_data',
          callback: (payload) {
            _handleSupabaseChange(payload);
          },
        )
        .subscribe();
  }

  void _handleSupabaseChange(PostgresChangePayload payload) {
    // Handle real-time database changes
    switch (payload.eventType) {
      case PostgresChangeEvent.insert:
      case PostgresChangeEvent.update:
        _updateSyncData(payload.newRecord);
        break;
      case PostgresChangeEvent.delete:
        // Handle deletion
        break;
    }
  }

  void _updateSyncData(Map<String, dynamic> data) {
    _syncData = {..._syncData, ...data};
    notifyListeners();
  }

  void _handleQRScanResult(Map<String, dynamic> data) {
    final qrData = data['qrData'];
    if (qrData != null && qrData.startsWith(AppConstants.qrPrefix)) {
      final deviceIdFromQR = qrData.replaceFirst(AppConstants.qrPrefix, '');
      linkDevice(deviceIdFromQR);
    }
  }

  void _handleAgentUpdate(Map<String, dynamic> agentData) {
    // Update agent status or results
    _updateSyncData({'agents': agentData});
  }

  // Public methods
  Future<void> syncDataToCloud(Map<String, dynamic> data) async {
    try {
      await _supabase.from('sync_data').upsert({
        'device_id': _deviceId,
        'data': data,
        'updated_at': DateTime.now().toIso8601String(),
      });
      
      // Also send via WebSocket for immediate sync
      _sendMessage({
        'type': 'sync_data',
        'deviceId': _deviceId,
        'payload': data,
      });
    } catch (error) {
      debugPrint('Error syncing data to cloud: $error');
    }
  }

  void linkDevice(String targetDeviceId) {
    _sendMessage({
      'type': 'link_device',
      'deviceId': _deviceId,
      'targetDeviceId': targetDeviceId,
    });
  }

  String generateQRData() {
    return '${AppConstants.qrPrefix}$_deviceId';
  }

  void sendChatMessage(String message) {
    _sendMessage({
      'type': 'chat_message',
      'deviceId': _deviceId,
      'message': message,
      'timestamp': DateTime.now().toIso8601String(),
    });
  }

  void runAgent(String agentId, String input) {
    _sendMessage({
      'type': 'run_agent',
      'deviceId': _deviceId,
      'agentId': agentId,
      'input': input,
      'timestamp': DateTime.now().toIso8601String(),
    });
  }

  @override
  void dispose() {
    _channel?.sink.close();
    super.dispose();
  }
}