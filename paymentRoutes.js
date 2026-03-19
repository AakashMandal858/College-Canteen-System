const express = require("express");
const axios = require("axios");
const Order = require("../models/Order");

const router = express.Router();

// 🔥 INITIATE PAYMENT (Redirect Flow)
router.post("/initiate", async (req, res) => {
  try {
    const { amount } = req.body;

    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      {
        return_url: "http://localhost:3000/payment-success",
        website_url: "http://localhost:3000",
        amount: amount, // in paisa
        purchase_order_id: `ORDER-${Date.now()}`, // unique every time
        purchase_order_name: "College Canteen Order"
      },
      {
        headers: {
          Authorization: "Key 3ead2512edd94d0bb5fdf4735ef8bc72", // sandbox secret key
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    console.log("Initiate Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Payment initiation failed" });
  }
});

// 🔥 VERIFY PAYMENT
router.post("/verify", async (req, res) => {
  try {
    const { pidx, userId, cartItems, totalPrice } = req.body;

    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: "Key 3ead2512edd94d0bb5fdf4735ef8bc72"
        }
      }
    );

    if (response.data.status === "Completed") {

      // 🔥 CREATE ORDER HERE
      const newOrder = new Order({
        user: userId,
        items: cartItems,
        totalAmount: totalPrice,
        paymentStatus: "Paid"
      });

      await newOrder.save();

      res.json({ message: "Payment verified & Order created" });

    } else {
      res.status(400).json({ error: "Payment not completed" });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Verification failed" });
  }
});

module.exports = router;