// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';
import authReducer from '../features/auth/authSlice';
import orderReducer from '../features/order/orderSlice';
import productReducer from '../features/product/productSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import userReducer from '../features/user/userSlice';
import categoryReducer from '../features/category/categorySlice';
import shippingAddressReducer from '../features/shippingAddress/shippingAddressSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    cart: cartReducer,
    category: categoryReducer,
    product: productReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
    shippingAddress: shippingAddressReducer, // Add the shipping address reducer here
  },
});
