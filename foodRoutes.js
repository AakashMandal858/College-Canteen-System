const router = require("express").Router();
const Food = require("../models/Food");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

// GET ALL FOOD
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
});

// ADD FOOD (ADMIN)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, price, category } = req.body;

    const newFood = new Food({ name, price, category });
    await newFood.save();

    res.status(201).json(newFood);
  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
});

module.exports = router;
