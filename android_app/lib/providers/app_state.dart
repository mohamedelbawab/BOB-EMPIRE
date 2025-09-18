import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AppState extends ChangeNotifier {
  bool _isLoading = false;
  String _currentLanguage = 'ar';
  ThemeMode _themeMode = ThemeMode.dark;
  bool _turboMode = false;
  Map<String, dynamic> _config = {};

  // Getters
  bool get isLoading => _isLoading;
  String get currentLanguage => _currentLanguage;
  ThemeMode get themeMode => _themeMode;
  bool get turboMode => _turboMode;
  Map<String, dynamic> get config => _config;
  
  Locale get locale => Locale(_currentLanguage, _currentLanguage == 'ar' ? 'SA' : 'US');

  AppState() {
    _loadSettings();
  }

  void setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void setLanguage(String language) {
    _currentLanguage = language;
    _saveSettings();
    notifyListeners();
  }

  void setThemeMode(ThemeMode mode) {
    _themeMode = mode;
    _saveSettings();
    notifyListeners();
  }

  void toggleTurboMode() {
    _turboMode = !_turboMode;
    _saveSettings();
    notifyListeners();
  }

  void updateConfig(Map<String, dynamic> newConfig) {
    _config = {..._config, ...newConfig};
    _saveSettings();
    notifyListeners();
  }

  Future<void> _loadSettings() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _currentLanguage = prefs.getString('language') ?? 'ar';
      _themeMode = ThemeMode.values[prefs.getInt('theme_mode') ?? 2]; // Default to dark
      _turboMode = prefs.getBool('turbo_mode') ?? false;
      
      // Load config from local storage
      final configString = prefs.getString('app_config');
      if (configString != null) {
        // _config = json.decode(configString);
      }
      
      notifyListeners();
    } catch (e) {
      debugPrint('Error loading settings: $e');
    }
  }

  Future<void> _saveSettings() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('language', _currentLanguage);
      await prefs.setInt('theme_mode', _themeMode.index);
      await prefs.setBool('turbo_mode', _turboMode);
      
      // Save config to local storage
      // await prefs.setString('app_config', json.encode(_config));
    } catch (e) {
      debugPrint('Error saving settings: $e');
    }
  }
}