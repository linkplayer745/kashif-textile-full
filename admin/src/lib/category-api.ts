import api from "@/utils/axiosInstance";
import type { Category, AddCategoryRequest } from "./types";

export const categoryApi = {
  async addCategory(categoryData: AddCategoryRequest, image: File) {
    const formData = new FormData();

    // Add category data
    Object.entries(categoryData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Add image (single file)
    formData.append("image", image);

    const response = await api.post("/category", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  async getCategories(): Promise<Category[]> {
    const response = await api.get("/category/all");
    return response.data.categories;
  },

  async deleteCategory(categoryId: string) {
    const response = await api.delete(`/category/${categoryId}`);
    return response.data;
  },
};
