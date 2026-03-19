import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found ❌");
      return;
    }

    const res = await axios.get(
      "http://localhost:5000/api/orders/admin",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setOrders(res.data);

  } catch (error) {
    console.log("Fetch Orders Error:", error.response?.data);
  }
};


  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:5000/api/order/${id}`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    fetchOrders();
  };

  const socket = io("http://localhost:5000");
  useEffect(() => {
    socket.on("newOrder", fetchOrders);
    socket.on("statusUpdated", fetchOrders);
    return () => {
      socket.off("newOrder");
      socket.off("statusUpdated");
    };
  },
  []);

  return (
    <div style={{ padding: 40 }}>
      <h2>Admin Orders Panel 👨‍🍳</h2>

      {orders.map(order => (
  <div key={order._id} style={{ border: "1px solid black", margin: 10, padding: 10 }}>
    
    <h3>🎫 Token: <b>{order.tokenNumber ?? "N/A"}</b></h3>

    <p>Status: {order.status}</p>
    <p>User: {order.userId.email}</p>
    <p>Total: Rs {order.totalAmount}</p>

    <button onClick={() => updateStatus(order._id, "Preparing")}>
      Preparing
    </button>

    <button onClick={() => updateStatus(order._id, "Completed")}>
      Completed
    </button>
  </div>
))}
    </div>
  );
}

export default AdminDashboard;
