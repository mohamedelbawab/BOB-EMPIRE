# Bob Empire - منصة التجارة الذكية العالمية

![Bob Empire](https://github.com/user-attachments/assets/574c19f9-34c0-4fd5-bf94-203c0633672f)

## نظرة عامة

Bob Empire هي منصة تجارة إلكترونية متطورة مدعومة بالذكاء الاصطناعي، تهدف إلى توفير حلول تجارية شاملة مع دعم للأتمتة والذكاء الاصطناعي. المنصة تدعم أكثر من 140 وكيل ذكي و120+ تدفق تلقائي مع إمكانية الربط بجميع المنصات العالمية.

## الميزات الرئيسية ✨

### 🤖 الوكلاء الأذكياء (140+ وكيل)
- **وكيل الذكاء التجاري**: إدارة المتاجر الإلكترونية والمبيعات
- **وكيل خدمة العملاء**: دعم فني على مدار الساعة
- **وكيل التحليلات**: تحليل البيانات والتقارير المفصلة
- **وكيل التسويق الرقمي**: إدارة الحملات التسويقية
- **وكيل إدارة المخزون**: متابعة المخزون تلقائياً
- **وكيل الأمان السيبراني**: حماية النظام
- **وكيل التواصل الاجتماعي**: إدارة الحسابات
- **وكيل الترجمة**: ترجمة المحتوى لعدة لغات
- وأكثر من 130 وكيل متخصص آخر

### ⚡ التدفقات التلقائية (120+ تدفق)
- **تدفق إدارة الطلبات**: من الاستلام حتى التسليم
- **تدفق التسويق التلقائي**: حملات متكاملة عبر جميع المنصات
- **تدفق خدمة العملاء الذكي**: ردود تلقائية ذكية
- **تدفق تحليل المنافسين**: مراقبة وتحديث الأسعار
- **تدفق إدارة المخزون**: طلبات تجديد تلقائية
- **تدفق تحسين محركات البحث**: تحسين المحتوى تلقائياً
- **تدفق إدارة المرتجعات**: معالجة الإرجاع والاستبدال
- **تدفق تقييم جودة الخدمة**: جمع وتحليل التقييمات

### 🌍 المنصات العالمية
#### منصات التجارة الإلكترونية
- Amazon, Shopify, AliExpress, Alibaba
- eBay, Etsy, Walmart, Target
- Noon, Jumia, Souq (Amazon MEA)

#### منصات الدفع
- Stripe, PayPal, Square
- Fawry, Paymob (MENA)
- Apple Pay, Google Pay, Samsung Pay

#### منصات التواصل الاجتماعي
- Facebook, Instagram, WhatsApp
- Twitter/X, LinkedIn, TikTok
- Telegram, WeChat, VK

### 💬 المحادثة الذكية
- دعم اللغة العربية والإنجليزية
- التعرف على الصوت والاستجابة الصوتية
- أوامر ذكية لإدارة النظام
- معالجة اللهجات العامية

### 🎯 أوامر النظام الذكية
```
/run <agent_id> <text>    - تشغيل وكيل محدد
/connect all              - ربط جميع المنصات
/turbo on|off            - تفعيل/إيقاف وضع التسارع
/status                  - حالة النظام
/help                    - قائمة الأوامر
```

## التقنيات المستخدمة 🛠️

### Frontend
- **HTML5/CSS3**: واجهة مستخدم حديثة مع دعم RTL
- **JavaScript ES6+**: منطق الواجهة الأمامية
- **PWA**: تطبيق ويب تقدمي مع دعم العمل بدون إنترنت
- **Speech Recognition**: التعرف على الصوت
- **Responsive Design**: تصميم متجاوب لجميع الأجهزة

### Backend
- **Node.js + Express**: خادم API سريع ومرن
- **Supabase**: قاعدة بيانات ومصادقة في الوقت الفعلي
- **AI Integration**: دمج مع خدمات الذكاء الاصطناعي
- **RESTful API**: واجهة برمجة تطبيقات متكاملة

## التثبيت والإعداد 🚀

### المتطلبات
- Node.js 16+ 
- npm أو yarn
- حساب Supabase
- مفاتيح API للمنصات المختلفة

### خطوات التثبيت

1. **استنساخ المشروع**
```bash
git clone https://github.com/mohamedelbawab/BOB-EMPIRE.git
cd BOB-EMPIRE
```

2. **تثبيت التبعيات**
```bash
npm install
```

3. **إعداد متغيرات البيئة**
```bash
cp .env.example .env
```

قم بتعديل ملف `.env` وإضافة:
```env
# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Frontend Environment Variables
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# AI API Keys
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key

# Platform API Keys
AMAZON_API_KEY=your-amazon-key
SHOPIFY_API_KEY=your-shopify-key
STRIPE_SECRET_KEY=your-stripe-key
PAYPAL_CLIENT_ID=your-paypal-client-id
```

4. **تشغيل الخادم**
```bash
npm start
```

5. **الوصول للتطبيق**
افتح المتصفح وانتقل إلى `http://localhost:3000`

## الاستخدام 📖

### تسجيل الدخول
- استخدم أي بريد إلكتروني وكلمة مرور للدخول في وضع التطوير
- لالإنتاج، قم بإعداد Supabase Authentication

### إدارة الوكلاء
1. انتقل إلى تبويب "الوكلاء"
2. اختر وكيل من القائمة
3. اضغط "تشغيل" لتفعيل الوكيل
4. استخدم "إضافة وكيل جديد" لإنشاء وكلاء مخصصين

### إدارة التدفقات
1. انتقل إلى تبويب "التدفقات"
2. اختر تدفق من القائمة
3. اضغط "تشغيل" لبدء التدفق
4. راقب تقدم التنفيذ في الوقت الفعلي

### ربط المنصات
1. انتقل إلى تبويب "المنصات العالمية"
2. اختر المنصة المطلوبة
3. اضغط على اسم المنصة للربط
4. ادخل مفاتيح API المطلوبة

### استخدام المحادثة الذكية
1. انتقل إلى تبويب "المحادثة الذكية"
2. اكتب رسالتك أو استخدم الميكروفون
3. استخدم الأوامر الذكية مثل `/run 1 مرحبا`
4. تفاعل مع الردود التلقائية

## هيكل المشروع 📁

```
BOB-EMPIRE/
├── index.html          # الواجهة الرئيسية
├── main.js            # منطق الواجهة الأمامية
├── style.css          # تنسيقات CSS
├── server.js          # خادم Express
├── auth.js            # نظام المصادقة
├── ai.js              # معالج الذكاء الاصطناعي
├── config.js          # إعدادات التطبيق
├── agents.json        # بيانات الوكلاء (140+)
├── flows.json         # بيانات التدفقات (120+)
├── products.js        # إدارة المنتجات
├── manifest.json      # إعدادات PWA
├── service-worker.js  # Service Worker للPWA
├── package.json       # تبعيات المشروع
├── .env.example       # مثال لمتغيرات البيئة
└── README.md          # هذا الملف
```

## المساهمة 🤝

نرحب بالمساهمات من المطورين! يرجى اتباع هذه الخطوات:

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى Branch (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## الدعم والمساعدة 📞

- **الوثائق**: [Wiki](https://github.com/mohamedelbawab/BOB-EMPIRE/wiki)
- **المشاكل**: [Issues](https://github.com/mohamedelbawab/BOB-EMPIRE/issues)
- **المناقشات**: [Discussions](https://github.com/mohamedelbawab/BOB-EMPIRE/discussions)
- **البريد الإلكتروني**: support@bobempire.com

## الترخيص 📄

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

---

**Bob Empire** - حيث يلتقي الذكاء الاصطناعي بالتجارة العالمية 👑

![Made with ❤️ by Bob Empire Team](https://img.shields.io/badge/Made%20with-❤️-red.svg)
![Arabic Support](https://img.shields.io/badge/Arabic-Support-green.svg)
![AI Powered](https://img.shields.io/badge/AI-Powered-blue.svg)
