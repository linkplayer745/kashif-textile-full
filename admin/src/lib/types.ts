export interface Product {
  id?: string;
  categoryId?: string;
  name: string;
  price: number;
  discountedPrice?: number;
  description?: string;
  attributes?: Record<string, string>;
  variants?: Record<string, VariantOption[]>;
  images?: string[];
}

export interface VariantOption {
  name: string;
  code?: string;
}

// export interface Category {
//   _id: string;
//   name: string;
// }

export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  imageUrl: string;
  imagePublicId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddCategoryRequest {
  name: string;
  slug?: string;
  description?: string;
}
