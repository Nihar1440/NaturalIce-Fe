import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

//fetch all users
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch users"
        );
      } else if (axios.isAxiosError(error) && error.request) {
        return rejectWithValue("No response received from server.");
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);


const initialState = {
  users: [],
  loading: false,
  error: null,
  profile: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.users = [];
      state.error = null;
      state.loading = false;
    },
    clearUserProfile: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.users = [];
        state.error = action.payload || "Failed to fetch users";
      })
  },
});

export const { clearUsers, clearUserProfile } = userSlice.actions;
export default userSlice.reducer;
