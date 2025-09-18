// server.js
const express = require("express");
const bodyParser = require("body-parser");
const { getAIResponse } = require("./ai");
const { supabaseAuthRouter } = require("./auth");
const { productsRouter } = require("./products");

const app = express();
app.use(bodyParser.json());

// Routers
app.use("/api/auth", supabaseAuthRouter);
app.use("/api/products", productsRouter);

// AI endpoint
app.post("/api/ai", (req, res) => {
  const { message } = req.body;
  const reply = getAIResponse(message || "");
  res.json({ reply });
});

app.listen(3000, () => {
  console.log("✅ Backend running on http://localhost:3000");
});
