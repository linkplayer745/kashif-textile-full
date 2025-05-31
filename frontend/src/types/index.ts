export interface Product {
    id: string;
    categoryId: string
    slug:string;
    name: string;
    price: number;
    discountedPrice?: number;
    description: string;
    attributes: Record<string, string>;
    variants: Record<string, VariantOption[]>; 
    images: string[];
  }
  export interface VariantOption {
    name: string;
    code?: string;
  }

  export interface Category {
    id: string;
    name: string;
    imageUrl: string;
    description?: string;
  }