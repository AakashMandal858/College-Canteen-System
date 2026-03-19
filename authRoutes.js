const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const SECRET_KEY = "my_super_secret_key";

// 🔹 REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists ❌" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role: role || "student"
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully ✅" });

  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
});

// 🔹 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password ❌" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password ❌" });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful ✅",
      token,
      role: user.role
    });

  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
});

module.exports = router;
