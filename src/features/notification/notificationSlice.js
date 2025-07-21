import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
// Utility function to get the authentication headers
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/notifications/${userId}`, getAuthHeaders());
      if (data.notifications) {
        return data.notifications;
      }
      return [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markNotificationAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      // The second argument for axios.put is the body, which is empty here.
      const { data } = await axios.put(`${API_URL}/api/notifications/read/${notificationId}`, {}, getAuthHeaders());
      return data.notification;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteUserNotification = createAsyncThunk(
  "notifications/deleteUserNotification",
  async (notificationId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/notifications/delete/${notificationId}`, getAuthHeaders());
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  notifications: [],
  loading: false,
  error: null,
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(
          (n) => n._id === action.payload._id
        );
        if (index !== -1) {
          if (!state.notifications[index].isRead && action.payload.isRead) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
          state.notifications[index] = action.payload;
        }
      })
      .addCase(deleteUserNotification.fulfilled, (state, action) => {
        const index = state.notifications.findIndex((n) => n._id === action.payload);
        if (index !== -1) {
          if (!state.notifications[index].isRead) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
          state.notifications = state.notifications.filter(n => n._id !== action.payload);
        }
      });
  },
});

export default notificationSlice.reducer; 