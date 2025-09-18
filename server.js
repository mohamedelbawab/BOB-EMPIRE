// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
const { getAIResponse, runSuperAI } = require("./ai");
const { supabaseAuthRouter } = require("./auth");
const { productsRouter } = require("./products");

require("dotenv").config();

const app = express();

// Production security and performance middleware
if (process.env.NODE_ENV === 'production') {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.openai.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
      },
    },
  }));
  app.use(compression());
}

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://bob-empire.vercel.app', 'https://bobempire.com'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(__dirname)); // Serve static files

// Routers
app.use("/api/auth", supabaseAuthRouter);
app.use("/api/products", productsRouter);

// AI endpoint
app.post("/api/ai", async (req, res) => {
  try {
    const { message } = req.body;
    const reply = await getAIResponse(message || "");
    res.json({ reply });
  } catch (error) {
    console.error("AI API Error:", error);
    res.status(500).json({ error: "AI service temporarily unavailable" });
  }
});

// Super AI endpoint for advanced commands
app.post("/api/super-ai", async (req, res) => {
  try {
    const { command } = req.body;
    const reply = await runSuperAI(command || "");
    res.json({ reply });
  } catch (error) {
    console.error("Super AI Error:", error);
    res.status(500).json({ error: "Super AI service temporarily unavailable" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "2.2.0",
    environment: process.env.NODE_ENV || "development"
  });
});

// API status endpoint
app.get("/api/status", async (req, res) => {
  try {
    const status = await runSuperAI("/status");
    res.json({ status: "operational", details: status });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// Serve index.html for root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Catch-all handler for SPA routing
app.get("*", (req, res) => {
  // Only serve index.html for non-API routes
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, "index.html"));
  } else {
    res.status(404).json({ error: "API endpoint not found" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Bob Empire ${process.env.NODE_ENV === 'production' ? 'Production' : 'Development'} Server running on http://localhost:${PORT}`);
  console.log(`🚀 Version: ${process.env.npm_package_version || "2.2.0"}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  process.exit(0);
});
