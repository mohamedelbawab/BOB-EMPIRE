// auth.js - Enhanced authentication module
const express = require("express");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Environment validation with fallbacks
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase credentials not found in environment variables. Using mock authentication.");
}

// Initialize Supabase client with error handling
let supabase = null;
try {
  if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project-ref.supabase.co') {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log("✅ Supabase client initialized successfully");
  } else {
    console.log("🔄 Using mock authentication mode - configure Supabase for production");
  }
} catch (error) {
  console.error("❌ Failed to initialize Supabase client:", error.message);
}

const router = express.Router();

// Enhanced signup with validation
router.post("/signup", async (req, res) => {
  try {
    const { email, password, userData } = req.body;
    
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: "البريد الإلكتروني وكلمة المرور مطلوبان",
        success: false 
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ 
        error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        success: false 
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: "البريد الإلكتروني غير صحيح",
        success: false 
      });
    }

    if (supabase) {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: userData || {}
        }
      });
      
      if (error) {
        return res.status(400).json({ 
          error: translateAuthError(error.message), 
          success: false 
        });
      }
      
      res.json({ 
        message: "✅ تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني", 
        success: true,
        data: data.user 
      });
    } else {
      // Mock response for development
      res.json({ 
        message: "✅ تم إنشاء الحساب بنجاح (وضع التطوير)", 
        success: true,
        data: { id: Date.now(), email, created_at: new Date().toISOString() }
      });
    }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ 
      error: "حدث خطأ في الخادم. يرجى المحاولة مرة أخرى", 
      success: false 
    });
  }
});

// Enhanced login with validation
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: "البريد الإلكتروني وكلمة المرور مطلوبان",
        success: false 
      });
    }

    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        return res.status(400).json({ 
          error: translateAuthError(error.message), 
          success: false 
        });
      }
      
      res.json({ 
        message: "✅ تم تسجيل الدخول بنجاح", 
        success: true,
        data: {
          user: data.user,
          session: data.session
        }
      });
    } else {
      // Mock response for development
      res.json({ 
        message: "✅ تم تسجيل الدخول بنجاح (وضع التطوير)", 
        success: true,
        data: {
          user: { id: Date.now(), email, created_at: new Date().toISOString() },
          session: { access_token: 'mock_token', expires_at: Date.now() + 3600000 }
        }
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      error: "حدث خطأ في الخادم. يرجى المحاولة مرة أخرى", 
      success: false 
    });
  }
});

// Logout endpoint
router.post("/logout", async (req, res) => {
  try {
    const { access_token } = req.body;
    
    if (supabase && access_token) {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return res.status(400).json({ 
          error: translateAuthError(error.message), 
          success: false 
        });
      }
    }
    
    res.json({ 
      message: "✅ تم تسجيل الخروج بنجاح", 
      success: true 
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ 
      error: "حدث خطأ في الخادم", 
      success: false 
    });
  }
});

// Password reset endpoint
router.post("/reset-password", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        error: "البريد الإلكتروني مطلوب",
        success: false 
      });
    }

    if (supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        return res.status(400).json({ 
          error: translateAuthError(error.message), 
          success: false 
        });
      }
    }
    
    res.json({ 
      message: "✅ تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني", 
      success: true 
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ 
      error: "حدث خطأ في الخادم", 
      success: false 
    });
  }
});

// User profile endpoint
router.get("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        error: "غير مصرح بالوصول", 
        success: false 
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (supabase) {
      const { data: user, error } = await supabase.auth.getUser(token);
      
      if (error) {
        return res.status(401).json({ 
          error: "رمز المصادقة غير صحيح", 
          success: false 
        });
      }
      
      res.json({ 
        success: true,
        data: user 
      });
    } else {
      // Mock response for development
      res.json({ 
        success: true,
        data: { 
          user: { 
            id: Date.now(), 
            email: "mock@example.com", 
            created_at: new Date().toISOString() 
          }
        }
      });
    }
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ 
      error: "حدث خطأ في الخادم", 
      success: false 
    });
  }
});

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "خدمة المصادقة تعمل بشكل صحيح",
    supabase_connected: !!supabase,
    timestamp: new Date().toISOString()
  });
});

// Translate Supabase error messages to Arabic
function translateAuthError(errorMessage) {
  const translations = {
    "Invalid email or password": "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    "Email already registered": "البريد الإلكتروني مسجل مسبقاً",
    "Password should be at least 6 characters": "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
    "Invalid email format": "تنسيق البريد الإلكتروني غير صحيح",
    "User not found": "المستخدم غير موجود",
    "Email not confirmed": "البريد الإلكتروني غير مؤكد",
    "Too many requests": "محاولات كثيرة جداً. يرجى المحاولة لاحقاً",
    "Network error": "خطأ في الشبكة. يرجى التحقق من الاتصال",
    "Service temporarily unavailable": "الخدمة غير متاحة مؤقتاً"
  };
  
  return translations[errorMessage] || errorMessage || "حدث خطأ غير متوقع";
}

module.exports = { 
  supabaseAuthRouter: router,
  supabase: supabase // Export for use in other modules
};
