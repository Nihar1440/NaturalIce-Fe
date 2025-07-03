// File: src/pages/CreateSuperAdminPage.jsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL;

const CreateSuperAdminPage = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/api/auth/create-superadmin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data._id) {
          Swal.fire('Success', 'Super Admin created', 'success');
          setForm({ email: '', password: '' });
        } else {
          throw new Error(data.message);
        }
      })
      .catch((err) => Swal.fire('Error', err.message, 'error'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-24">
      <div className="w-full max-w-3xl bg-white shadow rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6">Create Super Admin</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="superAdmin@gmail.com"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition text-lg"
          >
            Create Super Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSuperAdminPage;
