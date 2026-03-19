import { useEffect, useState } from "react";
import axios from "axios";

function Menu() {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/food");
      setFoods(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = async (foodId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/cart",
        { foodId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Added to cart 🛒");

    } catch (error) {
      console.log(error);
      alert("Error adding to cart");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Menu 🍽️</h2>

      {foods.map(food => (
        <div key={food._id} style={{ border: "1px solid black", margin: 10, padding: 10 }}>
          <h3>{food.name}</h3>
          <p>Price: Rs {food.price}</p>
          <button onClick={() => addToCart(food._id)}>
            Add to Cart 🛒
          </button>
        </div>
      ))}
    </div>
  );
}

export default Menu;
