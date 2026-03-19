import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function PaymentSuccess() {
  const location = useLocation();

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const pidx = params.get("pidx");

      try {
        await axios.post(
          "http://localhost:5000/api/payment/verify",
          {
            pidx,
            userId: localStorage.getItem("userId"),
            cartItems: JSON.parse(localStorage.getItem("cart")),
            totalPrice: localStorage.getItem("totalPrice")
          }
        );

        alert("Payment Verified & Token Generated 🎉");

      } catch (error) {
        console.log(error);
        alert("Verification failed");
      }
    };

    verifyPayment();
  }, [location]);

  return <h2>Processing Payment...</h2>;
}

export default PaymentSuccess;