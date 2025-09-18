// settings.js - Comprehensive Settings Management System for BOB-EMPIRE
const fs = require('fs').promises;
const path = require('path');

// Default settings configuration
const DEFAULT_SETTINGS = {
  // Application Settings
  app: {
    name: "Bob Empire",
    version: "2.2.0",
    language: "ar", // Default to Arabic
    theme: "dark",
    currency: "USD",
    timezone: "Africa/Cairo"
  },
  
  // AI Configuration
  ai: {
    enabled: true,
    provider: "openai",
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 150,
    arabicOptimized: true,
    voiceEnabled: true,
    voiceLanguage: "ar-EG"
  },
  
  // Platform Integrations
  platforms: {
    amazon: { enabled: false, region: "us-east-1" },
    shopify: { enabled: false, storeUrl: "" },
    aliexpress: { enabled: false, sandbox: true },
    alibaba: { enabled: false, sandbox: true },
    coupang: { enabled: false, region: "kr" },
    rakuten: { enabled: false, region: "jp" },
    shopee: { enabled: false, region: "sg" },
    lazada: { enabled: false, region: "sg" },
    mercadolibre: { enabled: false, region: "br" },
    flipkart: { enabled: false, region: "in" },
    ozon: { enabled: false, region: "ru" },
    wildberries: { enabled: false, region: "ru" },
    noon: { enabled: false, region: "ae" },
    jumia: { enabled: false, region: "ng" },
    souq: { enabled: false, region: "ae" },
    olx: { enabled: false, region: "eg" }
  },
  
  // Social Media Integration
  social: {
    facebook: { enabled: false, pageId: "" },
    instagram: { enabled: false, accountId: "" },
    whatsapp: { enabled: false, businessNumber: "" },
    telegram: { enabled: false, botToken: "" },
    linkedin: { enabled: false, pageId: "" },
    tiktok: { enabled: false, accountId: "" },
    x: { enabled: false, accountId: "" },
    wechat: { enabled: false, appId: "" },
    vk: { enabled: false, groupId: "" }
  },
  
  // Payment Configuration
  payments: {
    stripe: { enabled: false, currency: "USD" },
    paypal: { enabled: false, currency: "USD" },
    paymob: { enabled: false, currency: "EGP" },
    fawry: { enabled: false, currency: "EGP" },
    wise: { enabled: false, currency: "USD" },
    applePay: { enabled: false },
    googlePay: { enabled: false },
    alipay: { enabled: false },
    kakaoPay: { enabled: false },
    linePay: { enabled: false }
  },
  
  // Security Settings
  security: {
    rateLimiting: {
      enabled: true,
      windowMs: 60000,
      maxRequests: 100
    },
    cors: {
      enabled: true,
      allowedOrigins: ["http://localhost:3000"]
    },
    encryption: {
      enabled: true,
      algorithm: "aes-256-gcm"
    },
    twoFactorAuth: {
      enabled: false,
      provider: "google"
    }
  },
  
  // Notification Settings
  notifications: {
    email: {
      enabled: true,
      provider: "smtp",
      templates: {
        welcome: { ar: true, en: true },
        orderConfirmation: { ar: true, en: true },
        newsletter: { ar: true, en: true }
      }
    },
    push: {
      enabled: true,
      provider: "firebase",
      sound: true,
      badge: true
    },
    sms: {
      enabled: false,
      provider: "twilio"
    },
    whatsapp: {
      enabled: false,
      provider: "twilio"
    }
  },
  
  // Analytics & Monitoring
  analytics: {
    enabled: true,
    providers: {
      googleAnalytics: { enabled: false, trackingId: "" },
      facebookPixel: { enabled: false, pixelId: "" },
      hotjar: { enabled: false, siteId: "" }
    },
    customEvents: true,
    userTracking: {
      enabled: true,
      anonymize: true
    }
  },
  
  // Automation Settings
  automation: {
    enabled: true,
    maxConcurrentFlows: 10,
    retryAttempts: 3,
    timeoutMs: 30000,
    scheduling: {
      enabled: true,
      timezone: "Africa/Cairo"
    }
  },
  
  // Performance Settings
  performance: {
    caching: {
      enabled: true,
      ttl: 3600,
      maxSize: "100mb"
    },
    compression: {
      enabled: true,
      level: 6
    },
    cdn: {
      enabled: false,
      provider: "cloudflare"
    }
  },
  
  // Backup Settings
  backup: {
    enabled: true,
    frequency: "daily",
    retention: 30,
    storage: {
      local: true,
      cloud: false,
      provider: "aws-s3"
    }
  },
  
  // Development Settings
  development: {
    debug: false,
    logging: {
      level: "info",
      format: "json"
    },
    hotReload: false,
    mockApis: false
  }
};

class SettingsManager {
  constructor() {
    this.settingsFile = path.join(__dirname, 'settings.json');
    this.settings = { ...DEFAULT_SETTINGS };
    this.watchers = new Map();
  }
  
  // Load settings from file
  async load() {
    try {
      const data = await fs.readFile(this.settingsFile, 'utf8');
      const loadedSettings = JSON.parse(data);
      this.settings = this.mergeSettings(DEFAULT_SETTINGS, loadedSettings);
      console.log('✅ Settings loaded successfully');
      return this.settings;
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('⚠️ Settings file not found, creating with defaults');
        await this.save();
        return this.settings;
      }
      console.error('❌ Error loading settings:', error);
      throw error;
    }
  }
  
  // Save settings to file
  async save() {
    try {
      await fs.writeFile(this.settingsFile, JSON.stringify(this.settings, null, 2));
      console.log('✅ Settings saved successfully');
      this.notifyWatchers('save', this.settings);
    } catch (error) {
      console.error('❌ Error saving settings:', error);
      throw error;
    }
  }
  
  // Get a setting value by path (e.g., 'app.language')
  get(path) {
    return this.getNestedValue(this.settings, path);
  }
  
  // Set a setting value by path
  async set(path, value) {
    this.setNestedValue(this.settings, path, value);
    await this.save();
    this.notifyWatchers('change', { path, value });
  }
  
  // Get all settings
  getAll() {
    return { ...this.settings };
  }
  
  // Update multiple settings at once
  async update(updates) {
    this.settings = this.mergeSettings(this.settings, updates);
    await this.save();
    this.notifyWatchers('update', updates);
  }
  
  // Reset to default settings
  async reset() {
    this.settings = { ...DEFAULT_SETTINGS };
    await this.save();
    this.notifyWatchers('reset', this.settings);
  }
  
  // Reset specific section to defaults
  async resetSection(section) {
    if (DEFAULT_SETTINGS[section]) {
      this.settings[section] = { ...DEFAULT_SETTINGS[section] };
      await this.save();
      this.notifyWatchers('resetSection', { section, value: this.settings[section] });
    }
  }
  
  // Watch for setting changes
  watch(callback) {
    const watcherId = Date.now() + Math.random();
    this.watchers.set(watcherId, callback);
    return watcherId;
  }
  
  // Unwatch setting changes
  unwatch(watcherId) {
    this.watchers.delete(watcherId);
  }
  
  // Validate settings structure
  validate() {
    const errors = [];
    
    // Validate required fields
    if (!this.settings.app || !this.settings.app.name) {
      errors.push('App name is required');
    }
    
    if (!this.settings.app || !this.settings.app.language) {
      errors.push('App language is required');
    }
    
    // Validate AI settings
    if (this.settings.ai.enabled && !this.settings.ai.provider) {
      errors.push('AI provider is required when AI is enabled');
    }
    
    // Validate platform settings
    Object.keys(this.settings.platforms).forEach(platform => {
      const config = this.settings.platforms[platform];
      if (config.enabled && !config.region) {
        errors.push(`Region is required for enabled platform: ${platform}`);
      }
    });
    
    return errors;
  }
  
  // Export settings for backup
  async export() {
    return {
      timestamp: new Date().toISOString(),
      version: this.settings.app.version,
      settings: this.settings
    };
  }
  
  // Import settings from backup
  async import(backupData) {
    if (backupData.settings) {
      this.settings = this.mergeSettings(DEFAULT_SETTINGS, backupData.settings);
      await this.save();
      this.notifyWatchers('import', backupData);
    }
  }
  
  // Get settings schema for UI generation
  getSchema() {
    return {
      app: {
        title: "Application Settings",
        title_ar: "إعدادات التطبيق",
        fields: {
          name: { type: "text", required: true, label: "App Name", label_ar: "اسم التطبيق" },
          language: { type: "select", options: ["ar", "en"], label: "Language", label_ar: "اللغة" },
          theme: { type: "select", options: ["dark", "light"], label: "Theme", label_ar: "المظهر" },
          currency: { type: "select", options: ["USD", "EUR", "EGP", "SAR"], label: "Currency", label_ar: "العملة" }
        }
      },
      ai: {
        title: "AI Configuration",
        title_ar: "إعدادات الذكاء الاصطناعي",
        fields: {
          enabled: { type: "boolean", label: "Enable AI", label_ar: "تفعيل الذكاء الاصطناعي" },
          arabicOptimized: { type: "boolean", label: "Arabic Optimization", label_ar: "تحسين اللغة العربية" },
          voiceEnabled: { type: "boolean", label: "Voice Commands", label_ar: "الأوامر الصوتية" }
        }
      }
      // Add more sections as needed
    };
  }
  
  // Helper methods
  mergeSettings(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.mergeSettings(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }
  
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
  
  setNestedValue(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      return current[key];
    }, obj);
    target[lastKey] = value;
  }
  
  notifyWatchers(event, data) {
    this.watchers.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Error in settings watcher:', error);
      }
    });
  }
}

// Create global settings manager instance
const settingsManager = new SettingsManager();

// Initialize settings on module load
settingsManager.load().catch(error => {
  console.error('Failed to initialize settings:', error);
});

module.exports = {
  SettingsManager,
  settingsManager,
  DEFAULT_SETTINGS
};