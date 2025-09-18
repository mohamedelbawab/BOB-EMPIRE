import 'package:flutter/material.dart';

class LocalizationService {
  static const LocalizationsDelegate<LocalizationService> delegate = 
      _LocalizationServiceDelegate();

  static LocalizationService? of(BuildContext context) {
    return Localizations.of<LocalizationService>(context, LocalizationService);
  }

  final Locale locale;

  LocalizationService(this.locale);

  static final Map<String, Map<String, String>> _localizedValues = {
    'en': {
      'app_name': 'Bob Empire',
      'welcome': 'Welcome to Bob Empire',
      'login': 'Login',
      'signup': 'Sign Up',
      'email': 'Email',
      'password': 'Password',
      'chat': 'Chat',
      'store': 'Store',
      'agents': 'Agents',
      'settings': 'Settings',
      'home': 'Home',
    },
    'ar': {
      'app_name': 'بوب إمباير',
      'welcome': 'مرحباً بك في بوب إمباير',
      'login': 'تسجيل الدخول',
      'signup': 'إنشاء حساب',
      'email': 'البريد الإلكتروني',
      'password': 'كلمة المرور',
      'chat': 'الدردشة',
      'store': 'المتجر',
      'agents': 'الوكلاء',
      'settings': 'الإعدادات',
      'home': 'الرئيسية',
    },
  };

  String translate(String key) {
    return _localizedValues[locale.languageCode]?[key] ?? key;
  }
}

class _LocalizationServiceDelegate 
    extends LocalizationsDelegate<LocalizationService> {
  const _LocalizationServiceDelegate();

  @override
  bool isSupported(Locale locale) {
    return ['en', 'ar'].contains(locale.languageCode);
  }

  @override
  Future<LocalizationService> load(Locale locale) async {
    return LocalizationService(locale);
  }

  @override
  bool shouldReload(_LocalizationServiceDelegate old) => false;
}