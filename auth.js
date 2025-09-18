// auth.js
import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Check if Supabase is properly configured
let supabase = null;
let supabaseConfigured = false;

if (process.env.SUPABASE_URL && 
    process.env.SUPABASE_ANON_KEY && 
    process.env.SUPABASE_URL !== 'your-supabase-url-here' &&
    process.env.SUPABASE_ANON_KEY !== 'your-supabase-anon-key-here') {
  try {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    supabaseConfigured = true;
    console.log("✅ Supabase client initialized successfully");
  } catch (error) {
    console.warn("⚠️ Supabase configuration error:", error.message);
  }
} else {
  console.warn("⚠️ Supabase not configured. Using demo mode.");
}

const router = express.Router();

// Demo users storage (in-memory, for demo purposes only)
const demoUsers = new Map();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // If Supabase is configured, use it
  if (supabaseConfigured && supabase) {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return res.status(400).json({ error: error.message });
      res.json({ message: "✅ User registered successfully with Supabase" });
    } catch (error) {
      res.status(500).json({ error: "Supabase signup failed: " + error.message });
    }
  } else {
    // Demo mode - store in memory
    if (demoUsers.has(email)) {
      return res.status(400).json({ error: "User already exists" });
    }
    
    demoUsers.set(email, { email, password, createdAt: new Date() });
    res.json({ message: "✅ User registered successfully (Demo Mode)" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // If Supabase is configured, use it
  if (supabaseConfigured && supabase) {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return res.status(400).json({ error: error.message });
      res.json({ message: "✅ Logged in successfully with Supabase", data });
    } catch (error) {
      res.status(500).json({ error: "Supabase login failed: " + error.message });
    }
  } else {
    // Demo mode - check in-memory storage
    const user = demoUsers.get(email);
    if (!user || user.password !== password) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    
    res.json({ 
      message: "✅ Logged in successfully (Demo Mode)", 
      data: { user: { email } }
    });
  }
});

export { router as supabaseAuthRouter };
