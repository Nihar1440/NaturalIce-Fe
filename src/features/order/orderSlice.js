import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Assuming your backend API base URL
const API_URL = import.meta.env.VITE_API_URL; // Please adjust if your backend runs on a different port or domain

// Async thunk to fetch orders
// Note: This currently fetches ALL orders and relies on frontend filtering.
// For better performance with large datasets, consider a backend endpoint
// specifically for fetching orders by user ID or email (e.g., /api/orders/user/:email).
export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/order/orders`);
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer; 