import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";

interface CartItem {
  id: number;
  image: string;
  name: string;
  price: number;
  discountedPrice?: number;
  quantity: number;
  selectedVariants: {
    size?: string;
    color?: string;
    fit?: string;
  };
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;

      const existingItem = state.items.find((item) => {
        return (
          item.id === newItem.id &&
          item.selectedVariants.size === newItem.selectedVariants.size &&
          item.selectedVariants.color === newItem.selectedVariants.color &&
          item.selectedVariants.fit === newItem.selectedVariants.fit
        );
      });

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }

      toast.success("Item added to cart");
    },

    removeFromCart: (
      state,
      action: PayloadAction<{
        id: number;
        selectedVariants: {
          size?: string;
          color?: string;
          fit?: string;
        };
      }>,
    ) => {
      const { id, selectedVariants } = action.payload;

      state.items = state.items.filter(
        (item) =>
          !(
            item.id === id &&
            item.selectedVariants.size === selectedVariants.size &&
            item.selectedVariants.color === selectedVariants.color &&
            item.selectedVariants.fit === selectedVariants.fit
          ),
      );
    },

    increaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
