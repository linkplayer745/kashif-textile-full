// redux/slices/modalSlice.ts
import { VariantOption } from "@/data/products";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Product {
  id: number;
  name: string;
  price: number;
  discountedPrice?: number;
  description?: string;
  image: string;
  sizes?: VariantOption[];
  colors?: VariantOption[];
  fits?: VariantOption[];
}

interface ModalState {
  isOpen: boolean;
  product: Product | null;
}

const initialState: ModalState = {
  isOpen: false,
  product: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<Product>) {
      state.isOpen = true;
      state.product = action.payload;
    },
    closeModal(state) {
      state.isOpen = false;
      state.product = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
