// server.js - Enhanced backend server
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import modules
const { getAIResponse } = require("./ai");
const { supabaseAuthRouter } = require("./auth");
const { productsRouter } = require("./products");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:3000',
    'https://your-domain.com' // Add your production domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}));

// Security headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url} - ${req.ip}`);
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Bob Empire Backend is running',
    timestamp: new Date().toISOString(),
    version: '2.2.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use("/api/auth", supabaseAuthRouter);
app.use("/api/products", productsRouter);

// Enhanced AI endpoint with better error handling
app.post("/api/ai", async (req, res) => {
  try {
    const { message, context, language = 'ar' } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        error: "الرسالة مطلوبة" 
      });
    }
    
    const reply = await getAIResponse(message, context, language);
    
    res.json({ 
      success: true,
      reply,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI endpoint error:', error);
    res.status(500).json({ 
      success: false,
      error: "حدث خطأ في معالجة الطلب",
      message: "يرجى المحاولة مرة أخرى"
    });
  }
});

// Agent management endpoints
app.get('/api/agents', (req, res) => {
  try {
    // Mock agents data - replace with actual database call
    const agents = require('./agents.json').agents || [];
    res.json({
      success: true,
      data: agents,
      count: agents.length
    });
  } catch (error) {
    console.error('Agents fetch error:', error);
    res.status(500).json({
      success: false,
      error: "فشل في جلب بيانات الوكلاء"
    });
  }
});

app.post('/api/agents', (req, res) => {
  try {
    const { name, role, description } = req.body;
    
    if (!name || !role) {
      return res.status(400).json({
        success: false,
        error: "اسم الوكيل والدور مطلوبان"
      });
    }
    
    const newAgent = {
      id: Date.now(),
      name,
      role,
      description: description || '',
      status: 'idle',
      created_at: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: newAgent,
      message: "تم إضافة الوكيل بنجاح"
    });
  } catch (error) {
    console.error('Agent creation error:', error);
    res.status(500).json({
      success: false,
      error: "فشل في إضافة الوكيل"
    });
  }
});

// Flows management endpoints
app.get('/api/flows', (req, res) => {
  try {
    const flows = require('./flows.json') || [];
    res.json({
      success: true,
      data: flows,
      count: flows.length
    });
  } catch (error) {
    console.error('Flows fetch error:', error);
    res.status(500).json({
      success: false,
      error: "فشل في جلب بيانات التدفقات"
    });
  }
});

app.post('/api/flows', (req, res) => {
  try {
    const { name, trigger, steps } = req.body;
    
    if (!name || !trigger) {
      return res.status(400).json({
        success: false,
        error: "اسم التدفق والمشغل مطلوبان"
      });
    }
    
    const newFlow = {
      id: `flow_${Date.now()}`,
      name,
      trigger,
      steps: steps || [],
      status: 'active',
      created_at: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: newFlow,
      message: "تم إضافة التدفق بنجاح"
    });
  } catch (error) {
    console.error('Flow creation error:', error);
    res.status(500).json({
      success: false,
      error: "فشل في إضافة التدفق"
    });
  }
});

// Platform connections endpoint
app.post('/api/platforms/connect', (req, res) => {
  try {
    const { platform, credentials } = req.body;
    
    if (!platform) {
      return res.status(400).json({
        success: false,
        error: "اسم المنصة مطلوب"
      });
    }
    
    // Mock platform connection - replace with actual integration
    setTimeout(() => {
      res.json({
        success: true,
        message: `تم ربط منصة ${platform} بنجاح`,
        platform,
        connected_at: new Date().toISOString()
      });
    }, 1000);
  } catch (error) {
    console.error('Platform connection error:', error);
    res.status(500).json({
      success: false,
      error: "فشل في ربط المنصة"
    });
  }
});

// Dashboard data endpoint
app.get('/api/dashboard', (req, res) => {
  try {
    const dashboardData = {
      orders: Math.floor(Math.random() * 50) + 10,
      revenue: Math.floor(Math.random() * 10000) + 1000,
      activeAgents: 140,
      turbo: false,
      platforms: {
        connected: 5,
        total: 25
      },
      recentActivity: [
        { type: 'order', message: 'طلب جديد من العميل أحمد', time: '5 دقائق' },
        { type: 'agent', message: 'تم تشغيل وكيل التحليلات', time: '10 دقائق' },
        { type: 'platform', message: 'تم ربط منصة Shopify', time: '15 دقيقة' }
      ]
    };
    
    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({
      success: false,
      error: "فشل في جلب بيانات لوحة التحكم"
    });
  }
});

// SuperAI command endpoint
app.post('/api/superai', (req, res) => {
  try {
    const { command } = req.body;
    
    if (!command) {
      return res.status(400).json({
        success: false,
        error: "الأمر مطلوب"
      });
    }
    
    // Mock SuperAI processing - replace with actual implementation
    let response = "💡 أوامر متاحة: /run <id> <نص> | /connect all | /turbo on|off";
    
    if (command.includes('/turbo on')) {
      response = "🚀 تم تفعيل وضع التسارع بنجاح!";
    } else if (command.includes('/turbo off')) {
      response = "🐢 تم إيقاف وضع التسارع";
    } else if (command.includes('/connect all')) {
      response = "✅ تم ربط جميع المنصات العالمية بنجاح!";
    } else if (command.includes('/run')) {
      const parts = command.split(' ');
      const agentId = parts[1];
      response = `🤖 تم تشغيل الوكيل #${agentId} بنجاح`;
    }
    
    res.json({
      success: true,
      response,
      command,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('SuperAI error:', error);
    res.status(500).json({
      success: false,
      error: "فشل في تنفيذ الأمر"
    });
  }
});

// Configuration endpoint
app.get('/api/config', (req, res) => {
  res.json({
    success: true,
    data: {
      appName: "Bob Empire",
      version: "2.2.0",
      features: {
        agents: true,
        flows: true,
        platforms: true,
        superai: true,
        chat: true
      },
      supported_languages: ['ar', 'en'],
      max_agents: 1000,
      max_flows: 500
    }
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: "المسار المطلوب غير موجود",
    path: req.path
  });
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    success: false,
    error: "حدث خطأ في الخادم",
    message: "يرجى المحاولة مرة أخرى لاحقاً"
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Bob Empire Backend running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 API Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🏠 Frontend: http://localhost:${PORT}`);
});
