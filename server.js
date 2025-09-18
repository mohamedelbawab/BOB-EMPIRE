// server.js - Enhanced BOB-EMPIRE Server with Security
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { getAIResponse, runSuperAI } = require("./ai");
const { supabaseAuthRouter } = require("./auth");
const { productsRouter } = require("./products");

const app = express();

// Security Middleware
app.use((req, res, next) => {
  // Security headers for production-grade deployment
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Content Security Policy for enhanced security
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https: wss:; " +
    "media-src 'self';"
  );
  
  next();
});

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    // In production, specify your actual domains
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://bob-empire.vercel.app',
      // Add your production domains here
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting for API endpoints
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute

function rateLimit(req, res, next) {
  const clientId = req.ip || 'unknown';
  const now = Date.now();
  
  if (!rateLimitMap.has(clientId)) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return next();
  }
  
  const client = rateLimitMap.get(clientId);
  
  if (now > client.resetTime) {
    client.count = 1;
    client.resetTime = now + RATE_LIMIT_WINDOW;
    return next();
  }
  
  if (client.count >= RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({ 
      error: 'Rate limit exceeded. Please try again later.',
      error_ar: 'تم تجاوز الحد المسموح من الطلبات. يرجى المحاولة لاحقاً.'
    });
  }
  
  client.count++;
  next();
}

// Apply rate limiting to API routes
app.use('/api', rateLimit);

// Serve static files with proper headers
app.use(express.static(__dirname, {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    } else if (path.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
  }
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '2.2.0',
    message: 'BOB-EMPIRE is operational',
    message_ar: 'منصة Bob Empire تعمل بشكل طبيعي'
  });
});

// Routers
app.use("/api/auth", supabaseAuthRouter);
app.use("/api/products", productsRouter);

// AI endpoint with enhanced error handling
app.post("/api/ai", async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: "Message is required and must be a string",
        error_ar: "الرسالة مطلوبة ويجب أن تكون نص"
      });
    }
    
    if (message.length > 1000) {
      return res.status(400).json({ 
        error: "Message too long (max 1000 characters)",
        error_ar: "الرسالة طويلة جداً (الحد الأقصى 1000 حرف)"
      });
    }
    
    const reply = await getAIResponse(message);
    res.json({ reply });
  } catch (error) {
    console.error("AI API Error:", error);
    res.status(500).json({ 
      error: "AI service temporarily unavailable",
      error_ar: "خدمة الذكاء الاصطناعي غير متاحة مؤقتاً"
    });
  }
});

// Super AI endpoint with enhanced features
app.post("/api/super-ai", async (req, res) => {
  try {
    const { command } = req.body;
    
    if (!command || typeof command !== 'string') {
      return res.status(400).json({ 
        error: "Command is required and must be a string",
        error_ar: "الأمر مطلوب ويجب أن يكون نص"
      });
    }
    
    const reply = await runSuperAI(command);
    res.json({ reply });
  } catch (error) {
    console.error("Super AI Error:", error);
    res.status(500).json({ 
      error: "Super AI service temporarily unavailable",
      error_ar: "خدمة الذكاء الاصطناعي المتقدم غير متاحة مؤقتاً"
    });
  }
});

// Agents management endpoint
app.get("/api/agents", (req, res) => {
  try {
    const agents = require('./agents.json');
    res.json(agents);
  } catch (error) {
    console.error("Agents API Error:", error);
    res.status(500).json({ 
      error: "Failed to load agents",
      error_ar: "فشل في تحميل الوكلاء"
    });
  }
});

// Flows management endpoint
app.get("/api/flows", (req, res) => {
  try {
    const flows = require('./flows.json');
    res.json(flows);
  } catch (error) {
    console.error("Flows API Error:", error);
    res.status(500).json({ 
      error: "Failed to load automation flows",
      error_ar: "فشل في تحميل تدفقات الأتمتة"
    });
  }
});

// Serve index.html for root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: "Endpoint not found",
    error_ar: "الرابط غير موجود"
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({ 
    error: "Internal server error",
    error_ar: "خطأ داخلي في الخادم"
  });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`✅ BOB-EMPIRE Backend v2.2.0 running on http://localhost:${PORT}`);
  console.log(`🌍 Supporting Arabic & English`);
  console.log(`🔒 Security headers enabled`);
  console.log(`⚡ Rate limiting active`);
  console.log(`🚀 Ready for commercial launch!`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;
