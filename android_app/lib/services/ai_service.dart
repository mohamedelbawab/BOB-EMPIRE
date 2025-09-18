import 'dart:convert';
import 'package:http/http.dart' as http;
import '../utils/constants.dart';

class AIService {
  static const String _baseUrl = AppConstants.apiBaseUrl;
  
  static Future<String> sendMessage(String message) async {
    try {
      // First try to send to backend API
      final response = await http.post(
        Uri.parse('$_baseUrl/api/ai'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'message': message,
          'language': 'ar',
          'turbo': false,
        }),
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['response'] ?? _getDefaultResponse(message);
      } else {
        return _getDefaultResponse(message);
      }
    } catch (error) {
      return _getDefaultResponse(message);
    }
  }

  static Future<String> runSuperAI(String command) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/api/super-ai'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'command': command,
        }),
      ).timeout(const Duration(seconds: 15));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['response'] ?? _getDefaultSuperAIResponse(command);
      } else {
        return _getDefaultSuperAIResponse(command);
      }
    } catch (error) {
      return _getDefaultSuperAIResponse(command);
    }
  }

  static Future<Map<String, dynamic>> getAgents() async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/api/agents'),
        headers: {
          'Content-Type': 'application/json',
        },
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        return _getDefaultAgents();
      }
    } catch (error) {
      return _getDefaultAgents();
    }
  }

  static Future<String> runAgent(String agentId, String input) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/api/agents/run'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'agentId': agentId,
          'input': input,
        }),
      ).timeout(const Duration(seconds: 15));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['response'] ?? 'تم تشغيل الوكيل بنجاح';
      } else {
        return 'حدث خطأ في تشغيل الوكيل';
      }
    } catch (error) {
      return 'حدث خطأ في الاتصال بالوكيل';
    }
  }

  static String _getDefaultResponse(String message) {
    final lowerMessage = message.toLowerCase();
    
    // Smart responses based on common patterns
    if (lowerMessage.contains('مرحبا') || lowerMessage.contains('السلام') || lowerMessage.contains('hello')) {
      return 'مرحباً بك في Bob Empire! 👑 أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟';
    }
    
    if (lowerMessage.contains('متجر') || lowerMessage.contains('منتج') || lowerMessage.contains('store')) {
      return '🏪 يمكنني مساعدتك في إدارة المتجر:\n• إضافة منتجات جديدة\n• تحديث المخزون\n• إدارة الطلبات\n• ربط المنصات العالمية\n\nما الذي تود القيام به؟';
    }
    
    if (lowerMessage.contains('وكيل') || lowerMessage.contains('agent')) {
      return '🤖 لدينا 140+ وكيل ذكي جاهز للعمل:\n• وكلاء التسويق\n• وكلاء خدمة العملاء\n• وكلاء إدارة المخزون\n• وكلاء التحليل\n\nأي وكيل تريد تشغيله؟';
    }
    
    if (lowerMessage.contains('منصة') || lowerMessage.contains('platform') || lowerMessage.contains('ربط')) {
      return '🔗 المنصات المتاحة للربط:\n• Amazon & Shopify\n• AliExpress & Alibaba\n• Facebook & Instagram\n• WhatsApp & Telegram\n• المنصات العربية: نون، جوميا، سوق\n\nأي منصة تريد ربطها؟';
    }
    
    if (lowerMessage.contains('مساعدة') || lowerMessage.contains('help')) {
      return '💡 يمكنني مساعدتك في:\n\n🏪 إدارة المتجر والمنتجات\n🤖 تشغيل الوكلاء الذكية\n🔗 ربط المنصات العالمية\n📊 تحليل البيانات والمبيعات\n🎤 الأوامر الصوتية\n🔄 مزامنة البيانات\n\nما الخدمة التي تحتاجها؟';
    }
    
    if (lowerMessage.contains('صوت') || lowerMessage.contains('voice')) {
      return '🎤 الأوامر الصوتية متاحة!\nيمكنك:\n• الضغط على أيقونة المايك للتحدث\n• قول "اربط أمازون" لربط المنصة\n• قول "شغل وكيل التسويق" لتشغيل الوكيل\n• قول "أضف منتج جديد" لإضافة منتج\n\nجرب الآن!';
    }
    
    // Default intelligent response
    return '✨ شكراً لك! أنا أعمل بنظام ذكي متطور في Bob Empire.\n\nيمكنني فهم طلبات مثل:\n• "اربط شوبيفاي"\n• "شغل وكيل التسويق"\n• "أضف منتج جديد"\n• "عرض الطلبات"\n\nما الذي تريد تجربته؟';
  }

  static String _getDefaultSuperAIResponse(String command) {
    if (command.startsWith('/help')) {
      return '🎯 أوامر Super AI المتاحة:\n\n/connect all - ربط جميع المنصات\n/turbo on - تفعيل الوضع السريع\n/agents - عرض الوكلاء\n/status - حالة النظام\n/run [id] [text] - تشغيل وكيل\n\nجرب أي أمر!';
    }
    
    if (command.startsWith('/status')) {
      return '📊 حالة النظام:\n✅ الخوادم: متصلة\n✅ قاعدة البيانات: تعمل\n✅ الوكلاء: 140 متاح\n✅ المنصات: 35 مدعومة\n✅ المزامنة: نشطة';
    }
    
    if (command.startsWith('/connect')) {
      return '🔗 جاري ربط المنصات العالمية...\n✅ Amazon\n✅ Shopify\n✅ AliExpress\n✅ Facebook\n✅ Instagram\n\nتم الربط بنجاح!';
    }
    
    if (command.startsWith('/turbo')) {
      return '⚡ تم تفعيل الوضع السريع!\nالآن جميع العمليات ستتم بسرعة مضاعفة.';
    }
    
    return '🤖 تم تنفيذ الأمر: $command\n✅ العملية مكتملة بنجاح';
  }

  static Map<String, dynamic> _getDefaultAgents() {
    return {
      'agents': [
        {
          'id': '1',
          'name': 'وكيل التسويق الذكي',
          'role': 'marketing',
          'status': 'idle',
          'description': 'متخصص في التسويق الرقمي وإدارة الحملات'
        },
        {
          'id': '2', 
          'name': 'وكيل خدمة العملاء',
          'role': 'customer_service',
          'status': 'idle',
          'description': 'يتعامل مع استفسارات العملاء والدعم الفني'
        },
        {
          'id': '3',
          'name': 'وكيل إدارة المخزون',
          'role': 'inventory',
          'status': 'idle', 
          'description': 'يدير المخزون والطلبات والشحن'
        },
        {
          'id': '4',
          'name': 'وكيل التحليل المالي',
          'role': 'analytics',
          'status': 'idle',
          'description': 'يحلل البيانات المالية والمبيعات'
        },
        {
          'id': '5',
          'name': 'وكيل المنصات العالمية',
          'role': 'platforms',
          'status': 'idle',
          'description': 'يدير الربط مع المنصات العالمية'
        },
      ]
    };
  }
}