import { useEffect, useState } from "react";
import axios from "axios";

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/my-orders",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setOrders(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>My Orders 📜</h2>

      {orders.length === 0 ? (
        <p>No past orders</p>
      ) : (
        orders.map(order => (
          <div key={order._id} style={{ border: "1px solid black", margin: 10, padding: 10 }}>
            <h4>Status: {order.status}</h4>
            <p>Total: Rs {order.totalAmount}</p>

            {order.items.map(item => (
              <div key={item._id}>
                {item.foodId.name} × {item.quantity}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default OrderHistory;
