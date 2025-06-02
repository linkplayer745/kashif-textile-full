import { Category } from "@/types";
import api from "@/utils/axiosInstance";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Fetch categories for navbar
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (limit: number = 6, { rejectWithValue }) => {
    try {
      const response = await api.get("/category/all", {
        params: { limit }, // Use params instead of data for GET requests
      });
      return response.data.results;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch categories";
      console.error("Categories fetch error:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  },
);

interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  isLoading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    clearCategories: (state) => {
      state.categories = [];
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCategories, clearCategories, setError, clearError } =
  categoriesSlice.actions;

export default categoriesSlice.reducer;
