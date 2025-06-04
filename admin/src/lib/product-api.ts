import api from "@/utils/axiosInstance";
import type { Product } from "./types";

export const productApi = {
  async addProduct(
    productData: Omit<Product, "id" | "images">,
    images: File[],
  ) {
    const formData = new FormData();

    // Add product data
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "attributes" || key === "variants") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Add images
    images.forEach((image) => {
      formData.append("images", image);
    });

    const response = await api.post("/admin/add-product", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  async updateProduct(
    productId: string,
    productData: Partial<Product>,
    images?: File[],
  ) {
    const formData = new FormData();

    // Add product data
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined && key !== "id" && key !== "images") {
        if (key === "attributes" || key === "variants") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value === null ? "null" : value.toString());
        }
      }
    });

    // Add images if provided
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await api.patch(`/admin/product/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  async getCategories() {
    const response = await api.get("/categories");
    return response.data;
  },
};
