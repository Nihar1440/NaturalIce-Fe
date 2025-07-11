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

//Create User Registration
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/user/create`, userData);
      return response.data.data; 
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Registration failed');
      } else if (axios.isAxiosError(error) && error.request) {
        return rejectWithValue('No response received from server.');
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getUserProfile = createAsyncThunk(
  'user/getUserProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const accessToken = auth.accessToken;

      if (!accessToken) {
        return rejectWithValue('No access token available for fetching profile.');
      }

      const response = await axios.get(`${API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data.user; 
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch user profile');
      } else if (axios.isAxiosError(error) && error.request) {
        return rejectWithValue('No response received from server.');
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Updating User Profile
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async ({ userId, updateData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const accessToken = auth.accessToken;

      if (!accessToken) {
        return rejectWithValue('No access token available for updating profile.');
      }

      const response = await axios.put(`${API_URL}/api/user/update/${userId}`, updateData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data; 
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to update user profile');
      } else if (axios.isAxiosError(error) && error.request) {
        return rejectWithValue('No response received from server.');
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// fetching user profile
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async ({ accessToken }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data.user;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
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
  registrationSuccess: false,
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
    clearRegistrationStatus(state) {
      state.registrationSuccess = false;
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
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registrationSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.registrationSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.profile = null;
        state.registrationSuccess = false;
      })
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.profile = null;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.profile = null; 
      });
  },
});

export const { clearUsers, clearRegistrationStatus, clearUserProfile } = userSlice.actions;
export default userSlice.reducer;
