// routes/products.routes.js
const express = require("express");
const router = express.Router();
const { readDB, writeDB } = require("../utils/db");

router.post("/", (req, res) => {
  const db = readDB();
  const product = { id: Date.now(), ...req.body };
  db.products.push(product);
  writeDB(db);
  res.status(201).json(product);
});

router.get("/", (req, res) => {
  const db = readDB();
  res.json(db.products);
});

module.exports = router;
