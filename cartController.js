const Cart = require("../models/Cart");

// ADD TO CART (No duplicate)
exports.addToCart = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;

    const existingItem = await Cart.findOne({
      userId: req.user.id,
      foodId
    });

    if (existingItem) {
      existingItem.quantity += quantity || 1;
      await existingItem.save();

      return res.json({ message: "Cart updated ✅", cart: existingItem });
    }

    const newItem = new Cart({
      userId: req.user.id,
      foodId,
      quantity: quantity || 1
    });

    await newItem.save();

    res.status(201).json({ message: "Added to cart 🛒", cart: newItem });

  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
};

// GET CART
exports.getCart = async (req, res) => {
  const cart = await Cart.find({ userId: req.user.id }).populate("foodId");
  res.json(cart);
};

// UPDATE QUANTITY
exports.updateQuantity = async (req, res) => {
  const { quantity } = req.body;

  const updated = await Cart.findByIdAndUpdate(
    req.params.id,
    { quantity },
    { new: true }
  );

  res.json(updated);
};

// DELETE ITEM
exports.deleteItem = async (req, res) => {
  await Cart.findByIdAndDelete(req.params.id);
  res.json({ message: "Item removed ❌" });
};
