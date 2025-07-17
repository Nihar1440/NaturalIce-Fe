import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const accessToken = localStorage.getItem('accessToken');

// Fetch all orders
export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      // Build query string from params
      const query = new URLSearchParams();
      if (params.name) query.append("name", params.name);
      if (params.status) query.append("status", params.status);
      if (params.date) query.append("date", params.date);
      const queryString = query.toString() ? `?${query.toString()}` : "";
      const response = await axios.get(`${API_URL}/api/order/orders${queryString}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const fetchMyOrders = createAsyncThunk(
  'order/fetchMyOrders',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/order/user-orders/${userId}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch single order
export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/order/orders/${orderId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/api/order/orders/${orderId}`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete order
export const deleteOrder = createAsyncThunk(
  'order/deleteOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/order/orders/${orderId}`);
      return orderId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Return order
export const returnOrder = createAsyncThunk(
  'order/returnOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/order/orders/${orderId}/return`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Cancel order thunk (keep this)
export const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/api/order/orders/${orderId}/cancel`);
      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Track order
export const trackOrder = createAsyncThunk(
  'order/trackOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/order/orders/track/${orderId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    order: null, // for single order view
    loading: false,
    error: null,
    cancelLoading: false,
    cancelError: null,
    fetchOrderLoading: false,
    fetchOrderError: null,
    updateStatusLoading: false,
    updateStatusError: null,
    deleteLoading: false,
    deleteError: null,
    returnLoading: false,
    returnError: null,
    returnSuccess: null,
    tracking: null,
    trackingLoading: false,
    trackingError: null,
  },
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
      state.loading = false;
      state.error = null;
    },
    clearOrder: (state) => {
      state.order = null;
      state.fetchOrderError = null;
    },
    clearReturnStatus: (state) => {
      state.returnError = null;
      state.returnSuccess = null;
    },
    clearTracking: (state) => {
      state.tracking = null;
      state.trackingLoading = false;
      state.trackingError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all orders
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
      })

      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch single order
      .addCase(fetchOrderById.pending, (state) => {
        state.fetchOrderLoading = true;
        state.fetchOrderError = null;
        state.order = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.fetchOrderLoading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.fetchOrderLoading = false;
        state.fetchOrderError = action.payload;
      })

      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.updateStatusLoading = true;
        state.updateStatusError = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updateStatusLoading = false;
        // Update the order in the orders array
        state.orders = state.orders.map(order =>
          order._id === action.payload._id ? action.payload : order
        );
        // If viewing this order, update it too
        if (state.order && state.order._id === action.payload._id) {
          state.order = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updateStatusLoading = false;
        state.updateStatusError = action.payload;
      })

      // Delete order
      .addCase(deleteOrder.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.orders = state.orders.filter(order => order._id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      })

      // Return order
      .addCase(returnOrder.pending, (state) => {
        state.returnLoading = true;
        state.returnError = null;
        state.returnSuccess = null;
      })
      .addCase(returnOrder.fulfilled, (state, action) => {
        state.returnLoading = false;
        state.returnSuccess = action.payload?.message || "Return request placed successfully.";
        // Optionally update order status in list
        if (action.payload?.order) {
          state.orders = state.orders.map(order =>
            order._id === action.payload.order._id ? action.payload.order : order
          );
          if (state.order && state.order._id === action.payload.order._id) {
            state.order = action.payload.order;
          }
        }
      })
      .addCase(returnOrder.rejected, (state, action) => {
        state.returnLoading = false;
        state.returnError = action.payload;
      })

      // Cancel order (keep this)
      .addCase(cancelOrder.pending, (state) => {
        state.cancelLoading = true;
        state.cancelError = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.cancelLoading = false;
        const updatedOrder = action.payload;
        state.orders = state.orders.map(order =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.cancelLoading = false;
        state.cancelError = action.payload;
      })

      // Track order
      .addCase(trackOrder.pending, (state) => {
        state.trackingLoading = true;
        state.trackingError = null;
        state.tracking = null;
      })
      .addCase(trackOrder.fulfilled, (state, action) => {
        state.trackingLoading = false;
        state.tracking = action.payload;
      })
      .addCase(trackOrder.rejected, (state, action) => {
        state.trackingLoading = false;
        state.trackingError = action.payload;
      });
  },
});

export const { clearOrders, clearOrder, clearReturnStatus, clearTracking } = orderSlice.actions;
export default orderSlice.reducer; 