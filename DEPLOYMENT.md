# 🚀 دليل النشر الشامل لمنصة Bob Empire
# BOB-EMPIRE Complete Deployment Guide

## 🌍 نظرة عامة / Overview

منصة Bob Empire هي منصة تجارة إلكترونية عالمية مدعومة بالذكاء الاصطناعي، مصممة للعمل على جميع البيئات (ويب، موبايل، كمبيوتر) مع دعم كامل للغة العربية واللهجة المصرية.

BOB-EMPIRE is a global AI-powered e-commerce platform designed to work across all environments (web, mobile, desktop) with full Arabic language and Egyptian dialect support.

## 📋 متطلبات النظام / System Requirements

### الحد الأدنى / Minimum Requirements
- Node.js 16.0.0+
- NPM 8.0.0+
- 512MB RAM
- 1GB Storage
- Internet Connection

### الموصى به / Recommended
- Node.js 18.0.0+
- NPM 9.0.0+
- 2GB RAM
- 5GB Storage
- High-speed Internet

## 🏗️ التثبيت المحلي / Local Installation

### 1. تحميل المشروع / Download Project
```bash
git clone https://github.com/mohamedelbawab/BOB-EMPIRE.git
cd BOB-EMPIRE
```

### 2. تثبيت التبعيات / Install Dependencies
```bash
npm install
```

### 3. إعداد متغيرات البيئة / Environment Setup
انسخ `.env.example` إلى `.env` وأضف مفاتيحك:
Copy `.env.example` to `.env` and add your keys:

```bash
cp .env.example .env
```

### 4. تشغيل الخادم / Start Server
```bash
# للتطوير / Development
npm run dev

# للإنتاج / Production
npm start
```

### 5. فتح التطبيق / Open Application
افتح المتصفح وانتقل إلى:
Open browser and navigate to: `http://localhost:3000`

## ☁️ النشر السحابي / Cloud Deployment

### نشر على Vercel / Vercel Deployment

#### 1. إعداد حساب Vercel / Vercel Account Setup
- سجل في [vercel.com](https://vercel.com)
- ثبت Vercel CLI: `npm i -g vercel`

#### 2. النشر / Deploy
```bash
# أول نشر / First deployment
vercel

# نشر للإنتاج / Production deployment
vercel --prod
```

#### 3. إعداد متغيرات البيئة في Vercel / Environment Variables in Vercel
اذهب إلى لوحة تحكم Vercel وأضف المتغيرات التالية:
Go to Vercel dashboard and add these variables:

```
SUPABASE_URL=your-production-supabase-url
SUPABASE_ANON_KEY=your-production-supabase-anon-key
OPENAI_API_KEY=your-production-openai-api-key
NODE_ENV=production
```

### إعداد قاعدة البيانات Supabase / Supabase Database Setup

#### 1. إنشاء مشروع Supabase / Create Supabase Project
- اذهب إلى [supabase.com](https://supabase.com)
- أنشئ مشروع جديد
- احفظ URL و ANON KEY

#### 2. إنشاء الجداول / Create Tables
```sql
-- جدول المنتجات / Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  description TEXT,
  description_ar TEXT,
  price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMP DEFAULT NOW()
);

-- جدول الوكلاء / Agents table
CREATE TABLE agents (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100),
  platform VARCHAR(100),
  capabilities JSONB,
  language JSONB,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- جدول التدفقات / Flows table
CREATE TABLE flows (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_type VARCHAR(50),
  platform VARCHAR(100),
  steps JSONB,
  language JSONB,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- جدول التكوين / Configuration table
CREATE TABLE config (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- جدول فحص الصحة / Health check table
CREATE TABLE health_ping (
  id SERIAL PRIMARY KEY,
  status VARCHAR(20),
  timestamp TIMESTAMP DEFAULT NOW()
);
```

## 🔧 إعداد المنصات العالمية / Global Platform Configuration

### منصات التجارة الإلكترونية / E-commerce Platforms

#### Amazon
```env
AMAZON_ACCESS_KEY_ID=your-amazon-access-key
AMAZON_SECRET_ACCESS_KEY=your-amazon-secret-key
AMAZON_PARTNER_TAG=your-amazon-partner-tag
```

#### Shopify
```env
SHOPIFY_API_KEY=your-shopify-api-key
SHOPIFY_API_SECRET=your-shopify-api-secret
SHOPIFY_STORE_URL=your-shopify-store-url
```

#### AliExpress & Alibaba
```env
ALIEXPRESS_APP_KEY=your-aliexpress-app-key
ALIEXPRESS_APP_SECRET=your-aliexpress-app-secret
ALIBABA_APP_KEY=your-alibaba-app-key
ALIBABA_APP_SECRET=your-alibaba-app-secret
```

### المنصات الإقليمية / Regional Platforms

#### كوريا / Korea (Coupang)
```env
COUPANG_ACCESS_KEY=your-coupang-access-key
COUPANG_SECRET_KEY=your-coupang-secret-key
```

#### روسيا / Russia (Ozon, Wildberries)
```env
OZON_CLIENT_ID=your-ozon-client-id
OZON_API_KEY=your-ozon-api-key
WILDBERRIES_API_KEY=your-wildberries-api-key
```

#### الشرق الأوسط / Middle East (Noon, Jumia)
```env
NOON_API_KEY=your-noon-api-key
JUMIA_API_KEY=your-jumia-api-key
```

### منصات الدفع / Payment Platforms
```env
STRIPE_SECRET_KEY=your-stripe-secret-key
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYMOB_API_KEY=your-paymob-api-key
FAWRY_MERCHANT_CODE=your-fawry-merchant-code
```

## 📱 إعداد التطبيق للموبايل / Mobile App Setup

### Flutter (iOS & Android)

#### 1. إعداد Flutter / Flutter Setup
```bash
# تثبيت Flutter dependencies
flutter pub get

# تشغيل للتطوير
flutter run

# بناء للإنتاج
flutter build apk          # Android
flutter build ios          # iOS
```

#### 2. إعداد Supabase للموبايل / Supabase Mobile Setup
في `pubspec.yaml` تأكد من وجود:
In `pubspec.yaml` ensure you have:
```yaml
dependencies:
  supabase_flutter: ^2.0.0
```

## 🖥️ إعداد تطبيق سطح المكتب / Desktop App Setup

### Electron (Windows, macOS, Linux)

#### 1. تثبيت Electron / Install Electron
```bash
npm install electron --save-dev
```

#### 2. إنشاء ملف main.js للموبايل / Create main.js for electron
```javascript
const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadURL('http://localhost:3000');
}

app.whenReady().then(createWindow);
```

#### 3. بناء التطبيق / Build Application
```bash
npm run electron-pack
```

## 🧪 الاختبارات / Testing

### تشغيل جميع الاختبارات / Run All Tests
```bash
npm test
```

### اختبارات محددة / Specific Tests
```bash
# فحص صحة الخادم / Server health check
npm run test:health

# اختبار APIs
npm run test:api

# اختبار الأداء / Performance test
npm run test:performance
```

## 🌐 إعداد n8n للأتمتة / n8n Automation Setup

### 1. تثبيت n8n / Install n8n
```bash
npm install n8n -g
```

### 2. تشغيل n8n / Start n8n
```bash
n8n start
```

### 3. ربط n8n مع Bob Empire / Connect n8n with Bob Empire
```env
N8N_BASE_URL=your-n8n-instance-url
N8N_API_KEY=your-n8n-api-key
```

## 🔒 إعداد الأمان / Security Setup

### 1. SSL Certificate
للنشر على الإنتاج، تأكد من استخدام HTTPS:
For production deployment, ensure HTTPS usage:
```bash
# Certbot for free SSL
sudo certbot --nginx -d yourdomain.com
```

### 2. Firewall Configuration
```bash
# Ubuntu/Debian
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 3. Environment Security
- لا تنشر أبداً ملفات `.env` في Git
- استخدم أسرار قوية لقواعد البيانات
- فعل المصادقة الثنائية للحسابات المهمة

## 📊 المراقبة والصيانة / Monitoring & Maintenance

### 1. مراقبة الأداء / Performance Monitoring
```bash
# تحقق من استخدام الذاكرة / Check memory usage
free -h

# تحقق من استخدام القرص / Check disk usage
df -h

# مراقبة العمليات / Monitor processes
htop
```

### 2. النسخ الاحتياطية / Backups
```bash
# نسخة احتياطية لقاعدة البيانات / Database backup
pg_dump your_database > backup.sql

# نسخة احتياطية للملفات / Files backup
tar -czf bob_empire_backup.tar.gz /path/to/bob-empire
```

## 🚨 استكشاف الأخطاء وإصلاحها / Troubleshooting

### مشاكل شائعة / Common Issues

#### 1. خطأ "Port already in use"
```bash
# العثور على العملية التي تستخدم المنفذ / Find process using port
lsof -i :3000

# إيقاف العملية / Kill process
kill -9 <PID>
```

#### 2. مشاكل اتصال قاعدة البيانات / Database Connection Issues
- تحقق من صحة SUPABASE_URL و SUPABASE_ANON_KEY
- تأكد من أن قاعدة البيانات متاحة
- فحص إعدادات الشبكة

#### 3. مشاكل API
- تحقق من مفاتيح API
- فحص حدود المعدل (rate limits)
- مراجعة سجلات الأخطاء

## 📞 الدعم / Support

### الحصول على المساعدة / Getting Help
- 📧 البريد الإلكتروني / Email: support@bobempire.com
- 🐛 الإبلاغ عن الأخطاء / Bug Reports: GitHub Issues
- 📚 الوثائق / Documentation: GitHub Wiki
- 💬 المجتمع / Community: Discord Server

### المساهمة / Contributing
نرحب بمساهماتكم! يرجى قراءة CONTRIBUTING.md للحصول على التفاصيل.
We welcome contributions! Please read CONTRIBUTING.md for details.

---

## ✅ قائمة التحقق للنشر / Deployment Checklist

- [ ] تثبيت جميع التبعيات / All dependencies installed
- [ ] إعداد متغيرات البيئة / Environment variables configured  
- [ ] اختبار جميع APIs / All APIs tested
- [ ] إعداد قاعدة البيانات / Database configured
- [ ] إعداد منصات الدفع / Payment platforms configured
- [ ] اختبار الدعم متعدد اللغات / Multi-language support tested
- [ ] إعداد النسخ الاحتياطية / Backups configured
- [ ] إعداد المراقبة / Monitoring configured
- [ ] اختبار الأمان / Security tested
- [ ] اختبار الأداء / Performance tested
- [ ] وثائق المستخدم محدثة / User documentation updated

🎉 مبروك! منصة Bob Empire جاهزة للإطلاق التجاري!
🎉 Congratulations! BOB-EMPIRE platform is ready for commercial launch!