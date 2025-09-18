import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:speech_to_text/speech_to_text.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:permission_handler/permission_handler.dart';
import '../../providers/sync_provider.dart';
import '../../providers/app_state.dart';
import '../../services/ai_service.dart';
import '../../utils/theme.dart';
import '../../models/chat_message.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final SpeechToText _speechToText = SpeechToText();
  final FlutterTts _flutterTts = FlutterTts();
  
  List<ChatMessage> _messages = [];
  bool _isListening = false;
  bool _isTyping = false;
  bool _isSpeechEnabled = false;
  String _currentLocale = 'ar-SA';

  @override
  void initState() {
    super.initState();
    _initializeSpeech();
    _initializeTts();
    _addWelcomeMessage();
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    _speechToText.stop();
    _flutterTts.stop();
    super.dispose();
  }

  void _initializeSpeech() async {
    final status = await Permission.microphone.request();
    if (status == PermissionStatus.granted) {
      _isSpeechEnabled = await _speechToText.initialize(
        onStatus: (status) {
          setState(() {
            _isListening = status == 'listening';
          });
        },
        onError: (error) {
          setState(() {
            _isListening = false;
          });
        },
      );
    }
  }

  void _initializeTts() async {
    await _flutterTts.setLanguage(_currentLocale);
    await _flutterTts.setPitch(1.0);
    await _flutterTts.setSpeechRate(0.5);
  }

  void _addWelcomeMessage() {
    final welcomeMessage = ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      content: 'مرحباً بك في Bob Empire! 👑\n\nأنا مساعدك الذكي. يمكنني مساعدتك في:\n• إدارة المتجر والمنتجات\n• تشغيل الوكلاء الذكية\n• ربط المنصات العالمية\n• تنفيذ الأوامر الصوتية\n\nكيف يمكنني مساعدتك اليوم؟',
      isUser: false,
      timestamp: DateTime.now(),
      messageType: MessageType.text,
    );
    
    setState(() {
      _messages.add(welcomeMessage);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'دردشة الذكاء الاصطناعي',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        flexibleSpace: Container(
          decoration: BoxDecoration(gradient: AppTheme.primaryGradient),
        ),
        actions: [
          IconButton(
            onPressed: _clearChat,
            icon: const Icon(Icons.clear_all),
            tooltip: 'مسح المحادثة',
          ),
          Consumer<AppState>(
            builder: (context, appState, _) {
              return IconButton(
                onPressed: () {
                  final newLang = appState.currentLanguage == 'ar' ? 'en' : 'ar';
                  appState.setLanguage(newLang);
                  _currentLocale = newLang == 'ar' ? 'ar-SA' : 'en-US';
                  _flutterTts.setLanguage(_currentLocale);
                },
                icon: Text(
                  appState.currentLanguage == 'ar' ? 'EN' : 'ع',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                tooltip: 'تغيير اللغة',
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(child: _buildMessageList()),
          _buildInputArea(),
        ],
      ),
    );
  }

  Widget _buildMessageList() {
    return ListView.builder(
      controller: _scrollController,
      padding: const EdgeInsets.all(16),
      itemCount: _messages.length + (_isTyping ? 1 : 0),
      itemBuilder: (context, index) {
        if (index == _messages.length && _isTyping) {
          return _buildTypingIndicator();
        }
        return _buildMessageBubble(_messages[index]);
      },
    );
  }

  Widget _buildMessageBubble(ChatMessage message) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Row(
        mainAxisAlignment: message.isUser 
            ? MainAxisAlignment.end 
            : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (!message.isUser) ...[
            CircleAvatar(
              radius: 20,
              backgroundColor: AppTheme.primaryColor,
              child: const Text(
                '🤖',
                style: TextStyle(fontSize: 16),
              ),
            ),
            const SizedBox(width: 8),
          ],
          Flexible(
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: message.isUser 
                    ? AppTheme.primaryColor 
                    : Theme.of(context).cardColor,
                borderRadius: BorderRadius.circular(20).copyWith(
                  bottomRight: message.isUser 
                      ? const Radius.circular(5) 
                      : const Radius.circular(20),
                  bottomLeft: !message.isUser 
                      ? const Radius.circular(5) 
                      : const Radius.circular(20),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 5,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    message.content,
                    style: TextStyle(
                      color: message.isUser ? Colors.white : null,
                      fontSize: 16,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        _formatTime(message.timestamp),
                        style: TextStyle(
                          fontSize: 12,
                          color: message.isUser 
                              ? Colors.white70 
                              : Colors.grey.shade600,
                        ),
                      ),
                      if (!message.isUser) ...[
                        const SizedBox(width: 8),
                        InkWell(
                          onTap: () => _speakMessage(message.content),
                          child: Icon(
                            Icons.volume_up,
                            size: 16,
                            color: Colors.grey.shade600,
                          ),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
          ),
          if (message.isUser) ...[
            const SizedBox(width: 8),
            CircleAvatar(
              radius: 20,
              backgroundColor: AppTheme.goldColor,
              child: const Icon(
                Icons.person,
                color: Colors.white,
                size: 20,
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildTypingIndicator() {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          CircleAvatar(
            radius: 20,
            backgroundColor: AppTheme.primaryColor,
            child: const Text('🤖', style: TextStyle(fontSize: 16)),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              borderRadius: BorderRadius.circular(20).copyWith(
                bottomLeft: const Radius.circular(5),
              ),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                for (int i = 0; i < 3; i++) ...[
                  AnimatedContainer(
                    duration: Duration(milliseconds: 500 + (i * 200)),
                    curve: Curves.easeInOut,
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: AppTheme.primaryColor.withOpacity(0.5),
                      shape: BoxShape.circle,
                    ),
                  ),
                  if (i < 2) const SizedBox(width: 4),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInputArea() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).scaffoldBackgroundColor,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 5,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: Theme.of(context).cardColor,
                borderRadius: BorderRadius.circular(25),
                border: Border.all(
                  color: Theme.of(context).dividerColor,
                ),
              ),
              child: TextField(
                controller: _messageController,
                decoration: InputDecoration(
                  hintText: 'اكتب رسالتك...',
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 12,
                  ),
                  suffixIcon: _isSpeechEnabled
                      ? IconButton(
                          onPressed: _toggleListening,
                          icon: Icon(
                            _isListening ? Icons.mic : Icons.mic_none,
                            color: _isListening 
                                ? Colors.red 
                                : AppTheme.primaryColor,
                          ),
                        )
                      : null,
                ),
                maxLines: null,
                textInputAction: TextInputAction.send,
                onSubmitted: (_) => _sendMessage(),
              ),
            ),
          ),
          const SizedBox(width: 8),
          Container(
            decoration: BoxDecoration(
              gradient: AppTheme.primaryGradient,
              shape: BoxShape.circle,
            ),
            child: IconButton(
              onPressed: _sendMessage,
              icon: const Icon(
                Icons.send,
                color: Colors.white,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _sendMessage() async {
    final text = _messageController.text.trim();
    if (text.isEmpty) return;

    // Add user message
    final userMessage = ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      content: text,
      isUser: true,
      timestamp: DateTime.now(),
      messageType: MessageType.text,
    );

    setState(() {
      _messages.add(userMessage);
      _isTyping = true;
    });

    _messageController.clear();
    _scrollToBottom();

    // Send to sync provider
    final syncProvider = Provider.of<SyncProvider>(context, listen: false);
    syncProvider.sendChatMessage(text);

    // Get AI response
    try {
      final response = await AIService.sendMessage(text);
      
      final aiMessage = ChatMessage(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        content: response,
        isUser: false,
        timestamp: DateTime.now(),
        messageType: MessageType.text,
      );

      setState(() {
        _messages.add(aiMessage);
        _isTyping = false;
      });

      _scrollToBottom();
      
      // Auto-speak AI response for Arabic
      if (_currentLocale.startsWith('ar')) {
        _speakMessage(response);
      }
    } catch (error) {
      setState(() {
        _isTyping = false;
      });
      
      final errorMessage = ChatMessage(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        content: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
        isUser: false,
        timestamp: DateTime.now(),
        messageType: MessageType.error,
      );

      setState(() {
        _messages.add(errorMessage);
      });
      _scrollToBottom();
    }
  }

  void _toggleListening() async {
    if (_isListening) {
      await _speechToText.stop();
    } else {
      if (_isSpeechEnabled) {
        await _speechToText.listen(
          onResult: (result) {
            if (result.finalResult) {
              _messageController.text = result.recognizedWords;
            }
          },
          localeId: _currentLocale,
        );
      }
    }
  }

  void _speakMessage(String message) async {
    await _flutterTts.speak(message);
  }

  void _clearChat() {
    setState(() {
      _messages.clear();
    });
    _addWelcomeMessage();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  String _formatTime(DateTime time) {
    return '${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}';
  }
}