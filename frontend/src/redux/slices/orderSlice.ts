// src/store/slices/ordersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/axiosInstance";

// Types
interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  selectedVariant?: Record<string, string>;
}

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  state?: string;
  city: string;
  postalCode?: string;
  address1: string;
  address2?: string;
  shipToBilling: boolean;
  orderNotes?: string;
}

interface Order {
  id: string;
  user?: string;
  items: OrderItem[];
  shipping: ShippingInfo;
  subTotal: number;
  shippingCost: number;
  total: number;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

interface PaginatedOrders {
  results: Order[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface FetchOrdersParams {
  page: number;
  limit: number;
  orderId?: string;
  status?: string;
}

interface OrdersState {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    orderId: string;
    status: string;
  };
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Initial state
const initialState: OrdersState = {
  orders: [],
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filters: {
    orderId: "",
    status: "",
  },
  status: "idle",
  error: null,
};

// Async thunks
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (params: FetchOrdersParams, { rejectWithValue }) => {
    try {
      const requestParams: Record<string, any> = {
        page: params.page,
        limit: params.limit,
        sortBy: "createdAt:desc",
      };

      if (params.orderId) {
        requestParams.orderId = params.orderId;
      }
      if (params.status) {
        requestParams.status = params.status;
      }

      const response = await api.get<PaginatedOrders>("/order/user-orders", {
        params: requestParams,
      });

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch orders";
      return rejectWithValue(errorMessage);
    }
  },
);

// Slice
const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<Partial<OrdersState["filters"]>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { orderId: "", status: "" };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1;
    },
    resetOrdersState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload.results;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
          totalResults: action.payload.totalResults,
          hasNextPage: action.payload.hasNextPage,
          hasPrevPage: action.payload.hasPrevPage,
        };
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.orders = [];
      });
  },
});

export const { setFilters, clearFilters, setPage, setLimit, resetOrdersState } =
  ordersSlice.actions;

export default ordersSlice.reducer;
