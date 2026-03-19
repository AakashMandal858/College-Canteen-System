const router = require("express").Router();
const Cart = require("../models/Cart");
const { authMiddleware } = require("../middleware/authMiddleware");

// ===============================
// 🔹 ADD TO CART (Increase if exists)
// ===============================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { foodId } = req.body;

    const existing = await Cart.findOne({
      userId: req.user.id,
      foodId
    });

    if (existing) {
      existing.quantity += 1;
      await existing.save();
      return res.json(existing);
    }

    const newItem = new Cart({
      userId: req.user.id,
      foodId,
      quantity: 1
    });

    await newItem.save();
    res.status(201).json(newItem);

  } catch (err) {
    res.status(500).json({ message: "Server error ❌" });
  }
});


// ===============================
// 🔹 UPDATE QUANTITY
// ===============================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity <= 0) {
      await Cart.findByIdAndDelete(req.params.id);
      return res.json({ message: "Item removed" });
    }

    const updated = await Cart.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Server error ❌" });
  }
});


// ===============================
// 🔹 GET CART
// ===============================
router.get("/", authMiddleware, async (req, res) => {
  const items = await Cart.find({ userId: req.user.id })
    .populate("foodId");

  res.json(items);
});

module.exports = router;
