import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 

import cartReducer from '../features/cart/cartSlice';
import authReducer from '../features/auth/authSlice';
import orderReducer from '../features/order/orderSlice';
import productReducer from '../features/product/productSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import userReducer from '../features/user/userSlice';
import categoryReducer from '../features/category/categorySlice';
import shippingAddressReducer from '../features/shippingAddress/shippingAddressSlice';
import notificationReducer from "../features/notification/notificationSlice";
import paymentReducer from '../features/payment/paymentSlice';


const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  cart: cartReducer,
  category: categoryReducer,
  product: productReducer,
  wishlist: wishlistReducer,
  order: orderReducer,
  shippingAddress: shippingAddressReducer,
  notifications: notificationReducer,
  payment: paymentReducer,
});

// Configuration for redux-persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'cart', 'shippingAddress','category','payment']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Export store and persistor
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

