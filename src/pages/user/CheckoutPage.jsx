// File: src/pages/CheckoutPage.jsx
import React, { useState } from "react";
import Swal from "sweetalert2";

const CheckoutPage = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire(
      "Order Confirmed",
      "You will be redirected to payment.",
      "success"
    ).then(() => (window.location.href = "/order-confirmation"));
  };

  return (
    <div className="pt-24 max-w-2xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Checkout</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-lg shadow"
      >
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Name"
          className="w-full border border-gray-300 rounded px-4 py-2 focus:ring focus:ring-blue-500"
        />
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          placeholder="Phone"
          className="w-full border border-gray-300 rounded px-4 py-2 focus:ring focus:ring-blue-500"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="Email"
          className="w-full border border-gray-300 rounded px-4 py-2 focus:ring focus:ring-blue-500"
        />
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          required
          placeholder="Address"
          className="w-full border border-gray-300 rounded px-4 py-2 focus:ring focus:ring-blue-500"
        ></textarea>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Order Notes (optional)"
          className="w-full border border-gray-300 rounded px-4 py-2 focus:ring focus:ring-blue-500"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
