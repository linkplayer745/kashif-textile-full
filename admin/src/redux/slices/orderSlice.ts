// src/redux/slices/ordersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/axiosInstance";

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  selectedVariant?: Record<string, string>;
}

export interface Order {
  id: string;
  createdAt: string;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  subTotal: number;
  shippingCost: number;
  total: number;
}

export interface PaginatedOrders {
  results: Order[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface OrdersState extends PaginatedOrders {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  searchId: string;
}

const initialState: OrdersState = {
  results: [],
  page: 1,
  limit: 10,
  totalPages: 0,
  totalResults: 0,
  hasNextPage: false,
  hasPrevPage: false,
  status: "idle",
  error: null,
  searchId: "",
};

export const fetchOrders = createAsyncThunk<
  PaginatedOrders,
  { page?: number; limit?: number; orderId?: string; status?: string }
>("orders/fetchOrders", async (params, { rejectWithValue }) => {
  try {
    const res = await api.get("/order", { params });
    return res.data as PaginatedOrders;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch orders");
  }
});
// In your orderSlice.ts
export const updateOrderStatus = createAsyncThunk(
  "order/updateStatus",
  async ({ orderId, status }: { orderId: string; status: string }) => {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  },
);
const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setSearchId(state, action: PayloadAction<string>) {
      state.searchId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(fetchOrders.fulfilled, (s, action) => {
        const { results, page, limit, totalPages, totalResults } =
          action.payload;
        s.results = results;
        s.page = page;
        s.limit = limit;
        s.totalPages = totalPages;
        s.totalResults = totalResults;
        s.hasNextPage = page < totalPages;
        s.hasPrevPage = page > 1;
        s.status = "succeeded";
      })
      .addCase(fetchOrders.rejected, (s, action) => {
        s.status = "failed";
        s.error = action.payload as string;
      });
  },
});

export const { setSearchId } = ordersSlice.actions;
export default ordersSlice.reducer;
