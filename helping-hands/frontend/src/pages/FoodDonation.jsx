import { useState } from "react";

const restaurants = [
  {
    id: 1,
    name: "Paradise Biryani",
    menu: [
      { id: 101, name: "Chicken Biryani", price: 250 },
      { id: 102, name: "Mutton Biryani", price: 350 }
    ]
  },
  {
    id: 2,
    name: "Dominos",
    menu: [
      { id: 201, name: "Margherita Pizza", price: 199 },
      { id: 202, name: "Farmhouse Pizza", price: 299 }
    ]
  },
  {
    id: 3,
    name: "KFC",
    menu: [
      { id: 301, name: "Chicken Burger", price: 149 },
      { id: 302, name: "Zinger Burger", price: 199 }
    ]
  }
];

export default function FoodDonation() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeItem = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handlePayment = () => {
    const options = {
      key: "YOUR_RAZORPAY_KEY",
      amount: total * 100,
      currency: "INR",
      name: "Helping Hands",
      description: "Food Donation",
      handler: async function (response) {
        alert("Payment Successful ✅");

        // Save donation to backend
        await fetch("http://localhost:5000/api/donations/record", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "food",
            items: cart,
            amount: total,
            paymentId: response.razorpay_payment_id
          })
        });

        setCart([]);
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>Food Donation 🍽</h2>

      {/* Restaurants */}
      <h3>Select Restaurant</h3>
      {restaurants.map(r => (
        <button key={r.id} onClick={() => setSelectedRestaurant(r)}>
          {r.name}
        </button>
      ))}

      {/* Menu */}
      {selectedRestaurant && (
        <>
          <h3>{selectedRestaurant.name} Menu</h3>
          {selectedRestaurant.menu.map(item => (
            <div key={item.id}>
              {item.name} - ₹{item.price}
              <button onClick={() => addToCart(item)}>Add</button>
            </div>
          ))}
        </>
      )}

      {/* Cart */}
      <h3>Cart 🛒</h3>
      {cart.map((item, i) => (
        <div key={i}>
          {item.name} - ₹{item.price}
          <button onClick={() => removeItem(i)}>Remove</button>
        </div>
      ))}

      <h3>Total: ₹{total}</h3>

      {total > 0 && (
        <button onClick={handlePayment}>
          Pay ₹{total}
        </button>
      )}
    </div>
  );
}