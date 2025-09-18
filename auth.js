// auth.js
const express = require("express");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "✅ User registered successfully" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { error, data } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "✅ Logged in successfully", data });
});

module.exports = { supabaseAuthRouter: router };
