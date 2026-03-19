import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/food");
      setFoods(res.data);
    } catch (error) {
      console.log("Error fetching food");
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
      alert("Error adding to cart");
    }
  };

 return (
  <div className="min-h-screen bg-gray-100">

    {/* Navbar */}
    <div className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="text-2xl font-bold">College Canteen 🍔</h1>
      <button
        onClick={() => window.location.href="/cart"}
        className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200"
      >
        View Cart 🛒
      </button>
    </div>

    {/* Content */}
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Menu</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {foods.map((food) => (
          <div
            key={food._id}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300"
          >
            <h3 className="text-xl font-semibold">{food.name}</h3>
            <p className="text-gray-600 mt-2">Rs {food.price}</p>

            <button
              onClick={() => addToCart(food._id)}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>

  </div>
);
}

export default Dashboard;
