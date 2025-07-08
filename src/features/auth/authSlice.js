import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Helper to get initial state from localStorage
const loadAuthFromLocalStorage = () => {
  try {
    const userString = localStorage.getItem('user');
    const accessTokenString = localStorage.getItem('accessToken'); // Assuming accessToken is also saved

    const user = userString ? JSON.parse(userString) : null;
    const accessToken = accessTokenString || null; // Access token is usually a string

    return {
      user: user,
      accessToken: accessToken,
      isSuperAdmin: user?.isSuperAdmin || false,
    };
  } catch (e) {
    console.error("Failed to load auth state from localStorage:", e);
    return {
      user: null,
      accessToken: null,
      isSuperAdmin: false,
    };
  }
};

const initialState = {
  ...loadAuthFromLocalStorage(), // Load initial state from localStorage
  loading: false,
  error: null,
};

// New async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/user/create`, userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Registration failed');
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/user/login`, credentials, {
        withCredentials: true,
      });
      // Store accessToken in localStorage
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.userProfile));

      return {
        user: response.data.userProfile,
        accessToken: response.data.accessToken,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  }
);


// New async thunk for checking admin status
export const checkAdmin = createAsyncThunk(
  'auth/checkAdmin',
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/auth/check-admin`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Authentication failed');
      } else if (axios.isAxiosError(error) && error.request) {
        return rejectWithValue('No response received from server.');
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// New async thunk for logging out a user
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${API_URL}/api/user/logout`, {}, {
        withCredentials: true,
      });
      // Clear accessToken from localStorage on successful logout
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Logout failed');
      } else if (axios.isAxiosError(error) && error.request) {
        return rejectWithValue('No response received from server for logout.');
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// New async thunk for refreshing the access token
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/user/refresh-token`, {}, {
        withCredentials: true,
      });
      // Update accessToken in localStorage upon refresh
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      // Clear accessToken from localStorage if refresh fails (token likely expired/invalid)
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      return rejectWithValue(error.response?.data?.message || 'Failed to refresh token');
    }
  }
);

// New async thunk for getting user profile
export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const accessToken = auth.accessToken;
      if (!accessToken) {
        return rejectWithValue('No access token available.');
      }
      const response = await axios.get(`${API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data.user; // Backend returns { user }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch user profile');
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// New async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async ({ userId, userData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const accessToken = auth.accessToken;
      if (!accessToken) {
        return rejectWithValue('No access token available.');
      }
      const response = await axios.put(`${API_URL}/api/user/update/${userId}`, userData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data; // Backend returns the updated user object
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to update user profile');
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// New async thunk for forgot password request
export const forgotPasswordRequest = createAsyncThunk(
  'auth/forgotPasswordRequest',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/user/forgot-password`, { email });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to send reset link');
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// New async thunk for resetting password
export const resetPasswordConfirm = createAsyncThunk(
  'auth/resetPasswordConfirm',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/user/reset-password/${token}`, { password });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to reset password');
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState, // Use the dynamically loaded initial state
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isSuperAdmin = false;
      // Ensure localStorage is also cleared if logout is called directly (e.g., from an action)
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    },          
    setSuperAdminStatus(state, action) {
      state.isSuperAdmin = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null; 
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isSuperAdmin = action.payload.user?.isSuperAdmin || false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log('action', action)
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.accessToken = null;
        state.isSuperAdmin = false;
      })
      // Handlers for checkAdmin
      .addCase(checkAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; 
        state.isSuperAdmin = action.payload?.isSuperAdmin || false; 
        state.error = null; 
      })
      .addCase(checkAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.accessToken = null;
        state.isSuperAdmin = false;
      })
      // Handlers for logoutUser
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.isSuperAdmin = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.accessToken = null;
        state.isSuperAdmin = false;
      })
      // Handlers for refreshToken
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user; 
        state.isSuperAdmin = action.payload.user?.isSuperAdmin || false; 
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null; 
        state.accessToken = null;
        state.isSuperAdmin = false;
      })
      // Handlers for getUserProfile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Backend returns 'user' object directly
        state.isSuperAdmin = action.payload?.isSuperAdmin || false;
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null; // Clear user data if profile fetching fails
        state.isSuperAdmin = false;
      })
      // Handlers for updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Backend returns the updated user object
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handlers for forgotPasswordRequest
      .addCase(forgotPasswordRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordRequest.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPasswordRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handlers for resetPasswordConfirm
      .addCase(resetPasswordConfirm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordConfirm.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPasswordConfirm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setSuperAdminStatus } = authSlice.actions;
export default authSlice.reducer;
