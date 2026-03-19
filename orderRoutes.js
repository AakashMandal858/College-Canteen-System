const router = require("express").Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const { getIO } = require("../sockets/socket");

// ===============================
// 🔹 PLACE ORDER
// ===============================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user.id })
      .populate("foodId");

    if (cartItems.length === 0)
      return res.status(400).json({ message: "Cart is empty ❌" });

    let total = 0;

    const orderItems = cartItems.map(item => {
      total += item.foodId.price * item.quantity;
      return {
        foodId: item.foodId._id,
        quantity: item.quantity
      };
    });

    

    const newOrder = new Order({
      userId: req.user.id,
      items: orderItems,
      totalAmount: total,
      status: "Waiting for Payment",
      paymentStatus: "Pending",
      paymentMethod: "Khalti"
    });

    await newOrder.save();
    getIO().emit("newOrder", newOrder);

    await Cart.deleteMany({ userId: req.user.id });

    res.status(201).json(newOrder);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error ❌" });
  }
});


// ===============================
// 🔹 USER ORDER HISTORY
// ===============================
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("items.foodId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
});


// ===============================
// 🔹 ADMIN VIEW ALL ORDERS
// ===============================
router.get("/admin", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "email")
      .populate("items.foodId");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
});


// ===============================
// 🔹 UPDATE ORDER STATUS (ADMIN)
// ===============================
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    getIO().emit("statusUpdated", updated);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
});

// ===============================
// 🔹 PUBLIC DISPLAY ORDERS (NO LOGIN)
// ===============================
router.get("/display", async (req, res) => {
  try {
    const orders = await Order.find()
      .select("tokenNumber status")
      .sort({ tokenNumber: 1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
});

module.exports = router;
