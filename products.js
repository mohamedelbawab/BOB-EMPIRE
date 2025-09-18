// products.js
const express = require("express");
const router = express.Router();

let products = [
  { id: 1, name: "Hydrogel Eye Patches", price: 10 },
  { id: 2, name: "V-Line Mask", price: 15 }
];

router.get("/", (req, res) => {
  res.json(products);
});

router.post("/", (req, res) => {
  const { name, price } = req.body;
  const newProduct = { id: products.length + 1, name, price };
  products.push(newProduct);
  res.json(newProduct);
});

module.exports = { productsRouter: router };
