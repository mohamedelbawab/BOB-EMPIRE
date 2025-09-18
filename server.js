// server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { getAIResponse, runSuperAI } from "./ai.js";
import { supabaseAuthRouter } from "./auth.js";
import { productsRouter } from "./products.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend
app.use(bodyParser.json());
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

// Serve index.html for root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`⚠️ Supabase not configured. Using demo mode.`);
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
