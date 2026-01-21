// server.js
const express = require("express");
const app = express();
const productsRoutes = require("./routes/products.routes");
const ordersRoutes = require("./routes/orders.routes");
const analyticsRoutes = require("./routes/analytics.routes");

app.use(express.json());

app.use("/products", productsRoutes);
app.use("/orders", ordersRoutes);
app.use("/analytics", analyticsRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
