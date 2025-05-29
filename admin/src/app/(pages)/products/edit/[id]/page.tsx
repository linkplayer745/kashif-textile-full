"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/product-form";
import type { Product } from "@/lib/types";
import api from "@/utils/axiosInstance";
import { toast } from "sonner";
import React from "react";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/hooks/useStore";

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage() {
  // ...

  const params = useParams();
  const { id } = params;
  // const [product, setProduct] = useState<Product | null>(null);
  // const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const product = useAppSelector((state) => state.product.selectedProduct);
  // useEffect(() => {
  //   loadProduct();
  // }, [params.id]);

  // const loadProduct = async () => {
  //   try {
  //     const response = await api.get(`/admin/product/${id}`);
  //     setProduct(response.data);
  //   } catch (error) {
  //     toast.error("Error", {
  //       description: "Failed to load product",
  //     });
  //     router.push("/products");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSuccess = () => {
    router.push("/products");
  };

  const handleCancel = () => {
    router.push("/products");
  };

  // if (isLoading) {
  //   return (
  //     <div className="container mx-auto py-6">
  //       <div className="text-center">Loading...</div>
  //     </div>
  //   );
  // }

  if (!product) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">Product not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <ProductForm
        product={product}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
