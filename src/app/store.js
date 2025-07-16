// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import { combineReducers } from 'redux';

import cartReducer from '../features/cart/cartSlice';
import authReducer from '../features/auth/authSlice';
import orderReducer from '../features/order/orderSlice';
import productReducer from '../features/product/productSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import userReducer from '../features/user/userSlice';
import categoryReducer from '../features/category/categorySlice';
import shippingAddressReducer from '../features/shippingAddress/shippingAddressSlice';

// Create persist config for category
const categoryPersistConfig = {
  key: 'category',
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  cart: cartReducer,
  category: persistReducer(categoryPersistConfig, categoryReducer), // only category is persisted
  product: productReducer,
  wishlist: wishlistReducer,
  order: orderReducer,
  shippingAddress: shippingAddressReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

export const persistor = persistStore(store);
