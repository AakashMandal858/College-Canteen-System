const Order = require("../models/Order");
const Cart = require("../models/Cart");

// PLACE ORDER
exports.placeOrder = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user.id })
      .populate("foodId");

    if (cartItems.length === 0)
      return res.status(400).json({ message: "Cart is empty ❌" });

    let total = 0;

    const items = cartItems.map(item => {
      total += item.foodId.price * item.quantity;
      return {
        foodId: item.foodId._id,
        quantity: item.quantity
      };
    });

    const lastOrder = await Order.findOne().sort({ tokenNumber: -1 });
    const nextToken = lastOrder ? lastOrder.tokenNumber + 1 : 1;

    const newOrder = new Order({
      userId: req.user.id,
      items,
      totalAmount: total,
      tokenNumber: nextToken
    });

    await newOrder.save();
    await Cart.deleteMany({ userId: req.user.id });

    res.status(201).json(newOrder);

  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
};

// USER HISTORY
exports.getUserOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.id })
    .populate("items.foodId")
    .sort({ createdAt: -1 });

  res.json(orders);
};

// ADMIN VIEW ALL
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("userId", "email")
    .populate("items.foodId");

  res.json(orders);
};

// UPDATE STATUS
exports.updateStatus = async (req, res) => {
  const updated = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  res.json(updated);
};
