// routes/analytics.routes.js
const express = require("express");
const router = express.Router();
const { readDB } = require("../utils/db");

// All Orders with Count
router.get("/allorders", (req, res) => {
  const db = readDB();
  let list = [];
  db.orders.forEach(o => list.push(o));
  res.json({ count: list.length, orders: list });
});

// Cancelled Orders
router.get("/cancelled-orders", (req, res) => {
  const db = readDB();
  const cancelled = db.orders.filter(o => o.status === "cancelled");
  res.json({ count: cancelled.length, orders: cancelled });
});

// Shipped Orders
router.get("/shipped", (req, res) => {
  const db = readDB();
  const shipped = db.orders.filter(o => o.status === "shipped");
  res.json({ count: shipped.length, orders: shipped });
});

// Total Revenue by Product
router.get("/total-revenue/:productId", (req, res) => {
  const db = readDB();
  const product = db.products.find(p => p.id == req.params.productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const revenue = db.orders
    .filter(o => o.productId == product.id && o.status !== "cancelled")
    .reduce((sum, o) => sum + o.quantity * product.price, 0);

  res.json({ productId: product.id, totalRevenue: revenue });
});

// Overall Revenue
router.get("/alltotalrevenue", (req, res) => {
  const db = readDB();

  const totalRevenue = db.orders
    .filter(o => o.status !== "cancelled")
    .reduce((sum, o) => {
      const product = db.products.find(p => p.id === o.productId);
      return sum + o.quantity * product.price;
    }, 0);

  res.json({ totalRevenue });
});

module.exports = router;
