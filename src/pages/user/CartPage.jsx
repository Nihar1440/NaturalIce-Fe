import React, { useState } from 'react';
import { ChevronLeft, Trash2, Minus, Plus, Lock } from 'lucide-react';

export default function CartPage() {
  const [promoCode, setPromoCode] = useState('');
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'demand_room_01',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=100&h=75&fit=crop',
      price: 50,
      originalPrice: 60,
      quantity: 1,
    },
    {
      id: 2,
      name: 'Wireless Headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06f2e7?w=100&h=75&fit=crop',
      price: 120,
      originalPrice: 150,
      quantity: 2,
    },
    {
      id: 3,
      name: 'Smartwatch Pro',
      image: 'https://images.unsplash.com/photo-1546868871-70014b7e8ad5?w=100&h=75&fit=crop',
      price: 200,
      originalPrice: 220,
      quantity: 1,
    },
  ]);

  const handleQuantityChange = (itemId, change) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const tax = subtotal * 0.08; // Example tax calculation
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50 p-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Left Column - Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
                <h1 className="text-2xl font-medium text-gray-900">Your Cart</h1>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{totalItems} items</span>
                <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">{totalItems}</span>
              </div>
            </div>

            {/* Product Cards */}
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="flex items-center gap-4">
                  {/* Product Image with Badge */}
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-18 object-cover rounded-lg"
                    />
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                      {item.quantity}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-bold text-gray-900">${item.price}</span>
                      <span className="text-sm text-gray-400 line-through">${item.originalPrice}</span>
                      <span className="text-sm text-red-500">Save ${item.originalPrice - item.price}</span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <button
                        className="text-gray-600 hover:text-gray-800 font-medium"
                        onClick={() => handleQuantityChange(item.id, -1)}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-medium text-gray-900">{item.quantity}</span>
                      <button
                        className="text-gray-600 hover:text-gray-800 font-medium"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Right Side - Delete and Subtotal */}
                  <div className="flex flex-col items-end justify-between h-20">
                    <button
                      className="text-gray-400 hover:text-red-500 p-1"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">Subtotal</div>
                      <div className="text-xl font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Recommendations Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">You might also like</h3>
              <div className="grid grid-cols-4 gap-6">
                {/* Phone Case */}
                <div className="text-center">
                  <div className="w-full h-24 bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1601593346740-925612772716?w=100&h=96&fit=crop" 
                      alt="Phone Case" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Phone Case</h4>
                  <p className="text-sm font-semibold text-gray-900">$24.99</p>
                </div>

                {/* Bluetooth Speaker */}
                <div className="text-center">
                  <div className="w-full h-24 bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=96&fit=crop" 
                      alt="Bluetooth Speaker" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Bluetooth Speaker</h4>
                  <p className="text-sm font-semibold text-gray-900">$89.99</p>
                </div>

                {/* Laptop Stand */}
                <div className="text-center">
                  <div className="w-full h-24 bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=96&fit=crop" 
                      alt="Laptop Stand" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Laptop Stand</h4>
                  <p className="text-sm font-semibold text-gray-900">$49.99</p>
                </div>

                {/* USB Cable */}
                <div className="text-center">
                  <div className="w-full h-24 bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=96&fit=crop" 
                      alt="USB Cable" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">USB Cable</h4>
                  <p className="text-sm font-semibold text-gray-900">$14.99</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Order Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium">
                    Apply
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-4">
                Proceed to Checkout
                <span className="text-lg">→</span>
              </button>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6">
                <Lock className="w-4 h-4" />
                <span>Secure checkout</span>
              </div>

              {/* Payment Methods */}
              <div>
                <p className="text-sm text-gray-600 mb-3">We accept</p>
                <div className="flex gap-2">
                  <div className="px-3 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">VISA</div>
                  <div className="px-3 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">MC</div>
                  <div className="px-3 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">AMEX</div>
                  <div className="px-3 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">PP</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Windows Activation Notice */}
      <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-3 shadow-lg max-w-xs">
        <p className="text-sm text-gray-700 font-medium mb-1">Activate Windows</p>
        <p className="text-xs text-gray-500">Go to Settings to activate Windows</p>
      </div>

      {/* Purple Chat Button */}
      <div className="fixed bottom-4 right-4 mr-64">
        <button className="w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center shadow-lg">
          <span className="text-lg">💬</span>
        </button>
      </div>
    </div>
  );
}