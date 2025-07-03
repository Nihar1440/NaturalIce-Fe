import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Helper function to get the authorization header
const getConfig = () => {
  const token = localStorage.getItem('accessToken'); 
  if (token) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }
  return {};
};

// Async Thunk to fetch all categories
export const getCategories = createAsyncThunk(
  "category/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/category`, getConfig());
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch categories"
        );
      } else if (axios.isAxiosError(error) && error.request) {
        return rejectWithValue("No response received from server.");
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Async Thunk to fetch a single category by ID
export const getCategoryById = createAsyncThunk(
  "category/getCategoryById",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/category/${categoryId}`, getConfig());
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch category"
        );
      } else if (axios.isAxiosError(error) && error.request) {
        return rejectWithValue("No response received from server.");
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Async Thunk to create a new category
export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (categoryData, { rejectWithValue }) => {
    // categoryData should contain { name, description, status }
    try {
      const response = await axios.post(`${API_URL}/api/category/create`, categoryData, getConfig());
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to create category"
        );
      } else if (axios.isAxiosError(error) && error.request) {
        return rejectWithValue("No response received from server.");
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Async Thunk to update an existing category
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ _id, updateData }, { rejectWithValue }) => {
    // updateData can contain { name, description, status }
    try {
      const response = await axios.put(`${API_URL}/api/category/update/${_id}`, updateData, getConfig());
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to update category"
        );
      } else if (axios.isAxiosError(error) && error.request) {
        return rejectWithValue("No response received from server.");
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Async Thunk to delete a category
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (_id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/api/category/delete/${_id}`, getConfig());
      return response.data; // Backend returns { message: 'Category deleted successfully' }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to delete category"
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
  categories: [], 
  currentCategory: null, 
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategoryState: (state) => {
      state.categories = [];
      state.currentCategory = null;
      state.loading = false;
      state.error = null;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get All Categories
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch categories";
      })
      // Get Category By ID
      .addCase(getCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentCategory = null;
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCategory = action.payload;
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch category";
        state.currentCategory = null;
      })
      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload); // Add new category to the list
        state.currentCategory = action.payload; // Set as current if needed
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create category";
      })
      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        // Update the category in the 'categories' array
        const updatedCategory = action.payload;
        state.categories = state.categories.map((cat) =>
          cat._id === updatedCategory._id ? updatedCategory : cat
        );
        // Update currentCategory if it was the one being updated
        if (state.currentCategory && state.currentCategory._id === updatedCategory._id) {
          state.currentCategory = updatedCategory;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update category";
      })
      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted category from the 'categories' array
        // Assuming action.meta.arg contains the categoryId that was deleted
        const deletedCategoryId = action.meta.arg;
        state.categories = state.categories.filter(
          (cat) => cat._id !== deletedCategoryId
        );
        // Clear currentCategory if it was the one deleted
        if (state.currentCategory && state.currentCategory._id === deletedCategoryId) {
          state.currentCategory = null;
        }
        // You might want to store the success message from action.payload if needed
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete category";
      });
  },
});

export const { clearCategoryState, clearCurrentCategory } = categorySlice.actions;
export default categorySlice.reducer;
