"use client";

import { useRouter } from "next/navigation";
import ProductForm from "@/components/product-form";

export default function AddProductPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/products");
  };

  const handleCancel = () => {
    router.push("/products");
  };

  return (
    <div className="container mx-auto py-6">
      <ProductForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}
