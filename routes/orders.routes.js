// routes/orders.routes.js
const express = require("express");
const router = express.Router();
const { readDB, writeDB } = require("../utils/db");

const today = () => new Date().toISOString().split("T")[0];

// Create Order
router.post("/", (req, res) => {
  const { productId, quantity } = req.body;
  const db = readDB();

  const product = db.products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (product.stock === 0 || quantity > product.stock) {
    return res.status(400).json({ message: "Insufficient stock" });
  }

  const totalAmount = product.price * quantity;

  const order = {
    id: Date.now(),
    productId,
    quantity,
    totalAmount,
    status: "placed",
    createdAt: today()
  };

  product.stock -= quantity;
  db.orders.push(order);

  writeDB(db);
  res.status(201).json(order);
});

// Get All Orders
router.get("/", (req, res) => {
  const db = readDB();
  res.json(db.orders);
});

// Cancel Order
router.delete("/:orderId", (req, res) => {
  const db = readDB();
  const order = db.orders.find(o => o.id == req.params.orderId);

  if (!order) return res.status(404).json({ message: "Order not found" });

  if (order.status === "cancelled") {
    return res.status(400).json({ message: "Order already cancelled" });
  }

  if (order.createdAt !== today()) {
    return res.status(400).json({ message: "Cancellation period expired" });
  }

  const product = db.products.find(p => p.id === order.productId);
  product.stock += order.quantity;

  order.status = "cancelled";
  writeDB(db);

  res.json({ message: "Order cancelled", order });
});

// Change Status
router.patch("/change-status/:orderId", (req, res) => {
  const { status } = req.body;
  const db = readDB();
  const order = db.orders.find(o => o.id == req.params.orderId);

  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.status === "cancelled" || order.status === "delivered") {
    return res.status(400).json({ message: "Cannot change status" });
  }

  const flow = ["placed", "shipped", "delivered"];
  const currentIndex = flow.indexOf(order.status);
  const nextIndex = flow.indexOf(status);

  if (nextIndex !== currentIndex + 1) {
    return res.status(400).json({ message: "Invalid status flow" });
  }

  order.status = status;
  writeDB(db);

  res.json(order);
});

module.exports = router;
