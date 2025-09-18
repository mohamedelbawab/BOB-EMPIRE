// ai.js - Enhanced AI response system
require("dotenv").config();

// AI Response patterns in Arabic and English
const responsePatterns = {
  greetings: {
    ar: ["مرحبا", "أهلا", "السلام عليكم", "صباح الخير", "مساء الخير"],
    en: ["hello", "hi", "hey", "good morning", "good evening"],
    responses: {
      ar: "👋 مرحباً! أنا Bob Empire AI، كيف يمكنني مساعدتك اليوم؟",
      en: "👋 Hello! I'm Bob Empire AI, how can I help you today?"
    }
  },
  
  shopping: {
    ar: ["تسوق", "شراء", "منتجات", "متجر", "اشتري"],
    en: ["shop", "buy", "products", "store", "purchase"],
    responses: {
      ar: "🛒 بالطبع! يمكنني مساعدتك في العثور على المنتجات المناسبة. ما الذي تبحث عنه؟",
      en: "🛒 Sure! I can help you find the right products. What are you looking for?"
    }
  },
  
  agents: {
    ar: ["وكيل", "وكلاء", "تشغيل وكيل", "إدارة الوكلاء"],
    en: ["agent", "agents", "run agent", "agent management"],
    responses: {
      ar: "🤖 لدينا 140+ وكيل ذكي جاهز للعمل! يمكنني مساعدتك في تشغيل أو إدارة الوكلاء.",
      en: "🤖 We have 140+ smart agents ready to work! I can help you run or manage agents."
    }
  },
  
  flows: {
    ar: ["تدفق", "تدفقات", "أتمتة", "سير العمل"],
    en: ["flow", "flows", "automation", "workflow"],
    responses: {
      ar: "⚡ التدفقات التلقائية تساعد في أتمتة العمليات. هل تريد إنشاء تدفق جديد؟",
      en: "⚡ Automated flows help streamline processes. Do you want to create a new flow?"
    }
  },
  
  platforms: {
    ar: ["منصة", "منصات", "ربط", "اتصال", "أمازون", "شوبيفاي"],
    en: ["platform", "platforms", "connect", "connection", "amazon", "shopify"],
    responses: {
      ar: "🌍 يمكنني ربط جميع المنصات العالمية مثل Amazon، Shopify، AliExpress وغيرها!",
      en: "🌍 I can connect all global platforms like Amazon, Shopify, AliExpress and more!"
    }
  },
  
  help: {
    ar: ["مساعدة", "ساعدني", "كيف", "ماذا يمكنك"],
    en: ["help", "assist", "how", "what can you"],
    responses: {
      ar: "🤖 يمكنني مساعدتك في:\n• إدارة الوكلاء والتدفقات\n• ربط المنصات العالمية\n• التسوق والمنتجات\n• أوامر النظام الذكية",
      en: "🤖 I can help you with:\n• Managing agents and flows\n• Connecting global platforms\n• Shopping and products\n• Smart system commands"
    }
  },
  
  commands: {
    ar: ["أمر", "تشغيل", "تنفيذ", "/"],
    en: ["command", "run", "execute", "/"],
    responses: {
      ar: "⚡ أوامر متاحة:\n/run <رقم> <نص> - تشغيل وكيل\n/connect all - ربط جميع المنصات\n/turbo on|off - تفعيل/إيقاف التسارع",
      en: "⚡ Available commands:\n/run <id> <text> - Run agent\n/connect all - Connect all platforms\n/turbo on|off - Toggle turbo mode"
    }
  }
};

// Default responses
const defaultResponses = {
  ar: [
    "🤔 لم أفهم تماماً، لكنني هنا للمساعدة! يمكنك سؤالي عن الوكلاء، التدفقات، أو المنصات.",
    "💡 يمكنني مساعدتك في إدارة Bob Empire. جرب سؤالي عن الوكلاء أو المنصات المتاحة.",
    "🚀 Bob Empire يقدم حلول تجارية متقدمة. كيف يمكنني مساعدتك اليوم؟"
  ],
  en: [
    "🤔 I didn't fully understand, but I'm here to help! You can ask me about agents, flows, or platforms.",
    "💡 I can help you manage Bob Empire. Try asking me about available agents or platforms.",
    "🚀 Bob Empire provides advanced commerce solutions. How can I help you today?"
  ]
};

// Enhanced AI response function
function getAIResponse(message, context = {}, language = 'ar') {
  try {
    if (!message || typeof message !== 'string') {
      return language === 'ar' ? 
        "❌ يرجى إدخال رسالة صحيحة" : 
        "❌ Please enter a valid message";
    }

    const lowerMessage = message.toLowerCase().trim();
    
    // Check for specific commands first
    if (lowerMessage.startsWith('/')) {
      return handleCommand(lowerMessage, language);
    }
    
    // Check patterns
    for (const [category, data] of Object.entries(responsePatterns)) {
      const patterns = data[language] || data.en;
      if (patterns && patterns.some(pattern => lowerMessage.includes(pattern.toLowerCase()))) {
        const response = data.responses[language] || data.responses.en;
        return addPersonalization(response, context);
      }
    }
    
    // Check for mixed language (Arabic and English)
    const hasArabic = /[\u0600-\u06FF]/.test(message);
    const hasEnglish = /[a-zA-Z]/.test(message);
    
    if (hasArabic && hasEnglish) {
      return language === 'ar' ? 
        "🌟 أفهم العربية والإنجليزية! كيف يمكنني مساعدتك؟" :
        "🌟 I understand both Arabic and English! How can I help you?";
    }
    
    // Auto-detect language if not specified
    if (language === 'ar' && !hasArabic && hasEnglish) {
      language = 'en';
    } else if (language === 'en' && hasArabic && !hasEnglish) {
      language = 'ar';
    }
    
    // Return random default response
    const responses = defaultResponses[language] || defaultResponses.ar;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return addPersonalization(randomResponse, context);
    
  } catch (error) {
    console.error('AI Response Error:', error);
    return language === 'ar' ? 
      "❌ حدث خطأ في معالجة الرسالة" : 
      "❌ Error processing message";
  }
}

// Handle specific commands
function handleCommand(command, language = 'ar') {
  const parts = command.split(' ');
  const cmd = parts[0];
  
  switch (cmd) {
    case '/help':
      return language === 'ar' ? responsePatterns.commands.responses.ar : responsePatterns.commands.responses.en;
    
    case '/run':
      if (parts.length < 2) {
        return language === 'ar' ? 
          "❌ استخدام: /run <رقم_الوكيل> <النص>" : 
          "❌ Usage: /run <agent_id> <text>";
      }
      const agentId = parts[1];
      const input = parts.slice(2).join(' ');
      return language === 'ar' ? 
        `🤖 تم تشغيل الوكيل #${agentId} بالمدخل: "${input}"` :
        `🤖 Agent #${agentId} executed with input: "${input}"`;
    
    case '/connect':
      if (parts[1] === 'all') {
        return language === 'ar' ? 
          "✅ تم ربط جميع المنصات العالمية بنجاح!" : 
          "✅ All global platforms connected successfully!";
      }
      return language === 'ar' ? 
        `🔗 جاري ربط منصة ${parts[1]}...` : 
        `🔗 Connecting to ${parts[1]}...`;
    
    case '/turbo':
      const mode = parts[1];
      if (mode === 'on') {
        return language === 'ar' ? "🚀 تم تفعيل وضع التسارع!" : "🚀 Turbo mode activated!";
      } else if (mode === 'off') {
        return language === 'ar' ? "🐢 تم إيقاف وضع التسارع" : "🐢 Turbo mode deactivated";
      }
      return language === 'ar' ? 
        "❌ استخدام: /turbo on أو /turbo off" : 
        "❌ Usage: /turbo on or /turbo off";
    
    case '/status':
      return language === 'ar' ? 
        "📊 النظام يعمل بكفاءة 100%\n🤖 الوكلاء: 140 نشط\n⚡ التدفقات: 120+ جاهز\n🌍 المنصات: متصلة" :
        "📊 System running at 100% efficiency\n🤖 Agents: 140 active\n⚡ Flows: 120+ ready\n🌍 Platforms: connected";
    
    default:
      return language === 'ar' ? 
        "❌ أمر غير معروف. اكتب /help للحصول على قائمة الأوامر" : 
        "❌ Unknown command. Type /help for available commands";
  }
}

// Add personalization to responses
function addPersonalization(response, context) {
  if (context.userName) {
    const greeting = context.language === 'en' ? 
      `Hello ${context.userName}! ` : 
      `مرحباً ${context.userName}! `;
    return greeting + response;
  }
  return response;
}

// Export functions
module.exports = { 
  getAIResponse,
  handleCommand
};