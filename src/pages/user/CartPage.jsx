// File: src/pages/CartPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const updateQuantity = (index, delta) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += delta;
    if (updatedCart[index].quantity <= 0) updatedCart.splice(index, 1);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="pt-24 px-4">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item, idx) => (
            <div
              key={item.id}
              className="border border-gray-300 p-4 rounded-md flex justify-between items-center bg-white shadow-sm"
            >
              <div>
                <h4 className="font-semibold text-lg">{item.name}</h4>
                <p className="text-sm text-gray-600">Price: {item.price} AED</p>
                <p className="text-sm">Quantity: {item.quantity}</p>
              </div>
              <div className="space-x-2">
                <Button onClick={() => updateQuantity(idx, 1)}>+</Button>
                <Button
                  variant="outline"
                  onClick={() => updateQuantity(idx, -1)}
                >
                  -
                </Button>
              </div>
            </div>
          ))}
          <div className="text-right font-bold text-xl text-blue-700">
            Total: {total.toFixed(2)} AED
          </div>
          <div className="text-right">
            <Button className="mt-4" onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
