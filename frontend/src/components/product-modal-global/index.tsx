"use client";

import { closeModal } from "@/redux/slices/modalSlice";
import ProductModal from "../ui/product-modal";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function ProductModalGlobal() {
  const { isOpen, product } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  return (
    <ProductModal
      isOpen={isOpen}
      product={product || undefined}
      onClose={() => dispatch(closeModal())}
    />
  );
}
