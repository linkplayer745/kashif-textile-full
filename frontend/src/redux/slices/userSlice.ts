import api from "@/utils/axiosInstance";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";

export interface User {
  id: string;
  name?: string;
  email: string;
  password: string;
  isBlocked: boolean;
  details: {
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}
interface UpdateUserDetailsPayload {
  name?: string;
  details: {
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}

// Fetch user profile
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/profile");
      return response.data.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch profile";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  },
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData: UpdateUserDetailsPayload, { rejectWithValue }) => {
    try {
      const response = await api.put("/user/profile", userData);
      if (response.status === 200) {
        toast.success("Profile updated successfully!");
      }
      return response.data.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  },
);

// You can add more thunks as needed
export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (
    passwordData: { password: string; newPassword: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/auth/change-password", passwordData);
      toast.success("Password changed successfully!");
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to change password";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  },
);
interface UserState {
  currentUser: User | null;
  recentlyViewedProducts: string[];
  isLoading: boolean;
  error: string | null;
  updateLoading: boolean;
}

const initialState: UserState = {
  recentlyViewedProducts: [],
  currentUser: null,
  isLoading: false,
  error: null,
  updateLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    clearUser: (state) => {
      localStorage.removeItem("token");
      state.currentUser = null;
      toast("Logged out successfully");
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    addRecentlyViewedProduct: (state, action: PayloadAction<string>) => {
      console.log("adding product to recentlyViewedProducts", action.payload);

      if (!Array.isArray(state.recentlyViewedProducts)) {
        state.recentlyViewedProducts = [];
      }

      if (!state.recentlyViewedProducts.includes(action.payload)) {
        state.recentlyViewedProducts.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch user profile cases
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update user profile cases
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload as string;
      });

    // Change password cases
    builder
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setUser,
  updateUser,
  clearUser,
  setLoading,
  setError,
  clearError,

  addRecentlyViewedProduct,
} = userSlice.actions;

export default userSlice.reducer;
