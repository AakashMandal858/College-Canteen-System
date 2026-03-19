import { useEffect, useState } from "react";
import axios from "axios";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  const token = localStorage.getItem("token");

  // ===============================
  // 🔹 Fetch Cart
  // ===============================
  const fetchCart = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/cart",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCartItems(res.data);

    } catch (error) {
      console.log("Fetch cart error:", error);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, []);

  // ===============================
  // 🔹 Update Quantity
  // ===============================
  const updateQuantity = async (id, qty) => {
    try {
      await axios.put(
        `http://localhost:5000/api/cart/${id}`,
        { quantity: qty },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchCart();

    } catch (error) {
      console.log("Update error:", error);
    }
  };

  // ===============================
  // 🔹 Calculate Total
  // ===============================
  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.foodId.price * item.quantity;
  }, 0);

  // ===============================
  // 🔥 1️⃣ Create Order Then Open Khalti
  // ===============================
  const handleOrderAndPayment = async () => {
    try {
      const orderRes = await axios.post(
        "http://localhost:5000/api/orders",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const orderId = orderRes.data._id;
      setCurrentOrderId(orderId);
      openKhalti(orderId);

    } catch (error) {
      console.log(error);
      alert("Order creation failed ❌");
    }
  };

  // ===============================
// 🔥 2️⃣ Open Khalti Popup
// ===============================
const handlePayment = async () => {
  try {
    const paymentRes = await axios.post(
      "http://localhost:5000/api/payment/initiate",
      {
        amount: totalPrice * 100
      }
    );

    window.location.href = paymentRes.data.payment_url;

  } catch (error) {
    console.log(error);
    alert("Payment failed");
  }
};

  // ===============================
  // 🔥 3️⃣ Verify Payment With Backend
  // ===============================
  const verifyPayment = async (khaltiToken, amount, orderId) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/payment/khalti",
        {
          token: khaltiToken,
          amount,
          orderId
        }
      );

      alert(`Payment Successful 🎉 Token: ${res.data.tokenNumber}`);

      fetchCart();

    } catch (error) {
      console.log(error);
      alert("Payment verification failed ❌");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>🛒 My Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cartItems.map(item => (
            <div
              key={item._id}
              style={{
                border: "1px solid gray",
                padding: 10,
                marginBottom: 10
              }}
            >
              <h4>{item.foodId.name}</h4>
              <p>Price: Rs {item.foodId.price}</p>

              <div>
                <button
                  onClick={() =>
                    updateQuantity(item._id, item.quantity - 1)
                  }
                >
                  ➖
                </button>

                <span style={{ margin: "0 15px" }}>
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    updateQuantity(item._id, item.quantity + 1)
                  }
                >
                  ➕
                </button>
              </div>

              <p>
                Item Total: Rs{" "}
                {item.foodId.price * item.quantity}
              </p>
            </div>
          ))}

          <h3>Total Price: Rs {totalPrice}</h3>

          <button onClick={handlePayment}>
            💰 Pay & Place Order
            </button>
        </>
      )}
    </div>
  );
}

export default Cart;
