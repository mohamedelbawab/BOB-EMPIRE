class AppConstants {
  // Supabase Configuration
  static const String supabaseUrl = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: 'https://your-project.supabase.co',
  );
  
  static const String supabaseAnonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY', 
    defaultValue: 'your-anon-key-here',
  );
  
  // API Configuration
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:3000',
  );
  
  static const String openAiApiKey = String.fromEnvironment(
    'OPENAI_API_KEY',
    defaultValue: '',
  );
  
  // WebSocket Configuration
  static const String websocketUrl = String.fromEnvironment(
    'WEBSOCKET_URL',
    defaultValue: 'ws://localhost:3000/ws',
  );
  
  // App Configuration
  static const String appName = 'Bob Empire';
  static const String appVersion = '2.2.0';
  static const String adminPassword = 'Bob@Bob0000';
  
  // Voice Configuration
  static const String defaultLanguage = 'ar-SA';
  static const String fallbackLanguage = 'en-US';
  
  // QR Configuration
  static const String qrPrefix = 'bob_empire://';
  
  // Global Platforms
  static const List<String> supportedPlatforms = [
    'Amazon', 'Shopify', 'AliExpress', 'Alibaba',
    'Coupang', 'Rakuten', 'Shopee', 'Lazada',
    'MercadoLibre', 'Flipkart', 'Ozon', 'Wildberries',
    'Noon', 'Jumia', 'Souq', 'OLX',
    'Facebook', 'Instagram', 'WhatsApp', 'Telegram',
    'LinkedIn', 'TikTok', 'X', 'WeChat', 'VK',
    'Stripe', 'PayPal', 'Paymob', 'Fawry', 'Wise',
    'ApplePay', 'GooglePay', 'Alipay', 'KakaoPay', 'LinePay'
  ];
}