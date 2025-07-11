import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

//fetch cart items
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async ({ accessToken }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/cart/cartList`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch cart"
        );
      }
      return rejectWithValue(error.message);
    }
  }
);

// Add an item to the cart
export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async (
    { productId, quantity, price, accessToken, userId },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/cart/addToCart`,
        { productId, quantity, price, userId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to add item to cart"
        );
      }
      return rejectWithValue(error.message);
    }
  }
);

// Remove an item from the cart
export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async ({ productId, accessToken, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/cart/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: { userId },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to remove item from cart"
        );
      }
      return rejectWithValue(error.message);
    }
  }
);

// merge products into the user's cart
export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async ({ products, accessToken }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/cart/merge`,
        { products },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to merge cart items"
        );
      }
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCart(state) {
      state.items = [];
    },
    updateItemQuantity(state, action) {
      const { productId, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId._id === productId
      );
      if (existingItem) {
        existingItem.quantity = quantity;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handlers for fetchCartItems
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Handlers for addItemToCart
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Handlers for removeCartItem
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.cart.items;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Handlers for mergeCart
      .addCase(mergeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.cart.items;
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearCart, updateItemQuantity } = cartSlice.actions;

export default cartSlice.reducer;
