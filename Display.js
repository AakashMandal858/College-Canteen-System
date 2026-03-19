import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function Display() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders/display"
      );
      setOrders(res.data);
    } catch (error) {
      console.log("Display fetch error:", error);
    }
  };

  useEffect(() => {
    fetchOrders();

    socket.on("newOrder", fetchOrders);
    socket.on("statusUpdated", fetchOrders);

    return () => {
      socket.off("newOrder");
      socket.off("statusUpdated");
    };
  }, []);

  const preparing = orders.filter(o => o.status === "Preparing");
  const completed = orders.filter(o => o.status === "Completed");

  return (
    <div style={{
      textAlign: "center",
      backgroundColor: "black",
      color: "white",
      height: "100vh",
      paddingTop: "50px"
    }}>
      <h1 style={{ fontSize: "50px" }}>🎫 LIVE TOKEN DISPLAY</h1>

      <h2 style={{ color: "yellow" }}>Preparing</h2>
      {preparing.map(order => (
        <h1 key={order._id} style={{ fontSize: "40px" }}>
          Token {order.tokenNumber}
        </h1>
      ))}

      <h2 style={{ color: "lightgreen", marginTop: "40px" }}>
        Completed
      </h2>
      {completed.map(order => (
        <h1 key={order._id} style={{ fontSize: "35px" }}>
          Token {order.tokenNumber}
        </h1>
      ))}
    </div>
  );
}

export default Display;
