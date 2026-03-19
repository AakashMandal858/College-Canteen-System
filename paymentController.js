exports.initiatePayment = async (req, res) => {
  res.json({
    message: "Payment integration coming soon 💳",
    amount: req.body.amount
  });
};
