const express = require("express");
const cors = require("cors");
const http = require("http");

const connectDB = require("./config/db");
const { initSocket } = require("./sockets/socket");

const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const foodRoutes = require("./routes/foodRoutes");
const cron = require("node-cron");
const Order = require("./models/Order");

const app = express();
const server = http.createServer(app);

// Connect DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/food", foodRoutes);

// 🔥 Reset Orders Daily at Midnight
cron.schedule("0 0 * * *", async () => {
  try {
    await Order.deleteMany({});
    console.log("Daily token reset completed 🔄");
  } catch (error) {
    console.log("Reset error:", error);
  }
});


// Socket
initSocket(server);

// Start server
server.listen(5000, () => {
  console.log("Server running on http://localhost:5000 🚀");
});
