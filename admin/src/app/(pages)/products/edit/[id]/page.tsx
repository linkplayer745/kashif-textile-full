"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/product-form";
import React from "react";
import { useAppSelector } from "@/hooks/useStore";

export default function EditProductPage() {
  const router = useRouter();
  const product = useAppSelector((state) => state.product.selectedProduct);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!product) {
      router.push("/products");
    }

    setIsLoading(false);
  }, []);

  const handleSuccess = () => {
    router.push("/products");
  };

  const handleCancel = () => {
    router.push("/products");
  };

  if (isLoading || !product) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">Loading...</div>
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
