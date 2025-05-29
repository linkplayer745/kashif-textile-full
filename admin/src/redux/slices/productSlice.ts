import type { Product } from "@/lib/types";
import api from "@/utils/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}

export interface PaginatedResponse {
  results: Product[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 0,
    totalResults: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (params: PaginationParams = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, search, categoryId } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) {
        queryParams.append("searchTerm", search);
      }

      if (categoryId && categoryId !== "all") {
        queryParams.append("categoryId", categoryId);
      }

      const response = await api.get(
        `/admin/products?${queryParams.toString()}`,
      );
      return response.data as PaginatedResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch products");
    }
  },
);

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload,
      );
      // Update total results when deleting
      state.pagination.totalResults = Math.max(
        0,
        state.pagination.totalResults - 1,
      );
      // Recalculate total pages
      state.pagination.totalPages = Math.ceil(
        state.pagination.totalResults / state.pagination.limit,
      );
    },
    resetProducts: (state) => {
      state.products = [];
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.results;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
          totalResults: action.payload.totalResults,
          hasNextPage: action.payload.hasNextPage,
          hasPrevPage: action.payload.hasPrevPage,
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch products";
        toast(action.error.message || "Failed to fetch products");
      });
  },
});

export const { setSelectedProduct, deleteProduct, resetProducts } =
  productsSlice.actions;

export default productsSlice.reducer;
