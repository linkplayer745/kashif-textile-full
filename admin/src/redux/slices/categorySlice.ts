import { categoryApi } from "@/lib/category-api";
import { AddCategoryRequest, Category, Product } from "@/lib/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

export interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  isLoading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryApi.getCategories();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch Categories");
    }
  },
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (categoryId: string, { rejectWithValue }) => {
    try {
      await categoryApi.deleteCategory(categoryId);
      return categoryId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete category");
    }
  },
);

export const addCategory = createAsyncThunk(
  "category/addCategory",
  async (
    { categoryData, image }: { categoryData: AddCategoryRequest; image: File },
    { rejectWithValue },
  ) => {
    try {
      const response = await categoryApi.addCategory(categoryData, image);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add category");
    }
  },
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async (
    {
      categoryId,
      categoryData,
      image,
    }: {
      categoryId: string;
      categoryData: Partial<Category>;
      image?: File | null;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await categoryApi.updateCategory(
        categoryId,
        categoryData,
        image,
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update category");
    }
  },
);
export const categorySlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch products";
        toast.error(action.error.message || "Failed to fetch categories");
      })

      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (category) => category.id !== action.payload,
        );
        toast.success("Category deleted successfully");
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        toast.error(action.error.message || "Failed to delete category");
      })

      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
        toast.success("Category added successfully");
      })
      .addCase(addCategory.rejected, (state, action) => {
        toast.error(action.error.message || "Failed to add category");
      })

      .addCase(updateCategory.fulfilled, (state, action) => {
        const updatedCategory = action.payload;
        const index = state.categories.findIndex(
          (category) => category.id === updatedCategory.id,
        );
        if (index !== -1) {
          state.categories[index] = updatedCategory;
          toast.success("Category updated successfully");
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        toast.error(action.error.message || "Failed to update category");
      });
  },
});

export const {} = categorySlice.actions;

export default categorySlice.reducer;
