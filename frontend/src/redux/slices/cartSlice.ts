import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";

interface CartItem {
  id: string;
  image: string;
  name: string;
  price: number;
  discountedPrice?: number;
  quantity: number;
  selectedVariants: Record<string, string>; // Generic variants
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

// Helper function to compare variants generically
const variantsEqual = (
  variants1: Record<string, string>,
  variants2: Record<string, string>,
): boolean => {
  const keys1 = Object.keys(variants1);
  const keys2 = Object.keys(variants2);

  // Check if both have the same number of variant types
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Check if all variant types and values match
  return keys1.every((key) => variants1[key] === variants2[key]);
};

// Helper function to generate a unique identifier for cart items
const generateCartItemKey = (
  id: string,
  variants: Record<string, string>,
): string => {
  const variantString = Object.keys(variants)
    .sort() // Sort keys for consistent ordering
    .map((key) => `${key}:${variants[key]}`)
    .join("|");

  return `${id}${variantString ? `_${variantString}` : ""}`;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;

      // Find existing item with same id and variant combination
      const existingItem = state.items.find((item) => {
        return (
          item.id === newItem.id &&
          variantsEqual(item.selectedVariants, newItem.selectedVariants)
        );
      });

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
        toast.success(`Updated quantity in cart`, { position: "bottom-right" });
      } else {
        state.items.push(newItem);
        toast.success("Item added to cart", { position: "bottom-right" });
      }
    },

    removeFromCart: (
      state,
      action: PayloadAction<{
        id: string;
        selectedVariants: Record<string, string>;
      }>,
    ) => {
      const { id, selectedVariants } = action.payload;

      state.items = state.items.filter(
        (item) =>
          !(
            item.id === id &&
            variantsEqual(item.selectedVariants, selectedVariants)
          ),
      );

      toast.success("Item removed from cart", { position: "bottom-right" });
    },

    // Updated increase/decrease quantity to work with variants
    increaseQuantity: (
      state,
      action: PayloadAction<{
        id: string;
        selectedVariants: Record<string, string>;
      }>,
    ) => {
      const { id, selectedVariants } = action.payload;
      const item = state.items.find(
        (item) =>
          item.id === id &&
          variantsEqual(item.selectedVariants, selectedVariants),
      );
      if (item) {
        item.quantity += 1;
      }
    },

    decreaseQuantity: (
      state,
      action: PayloadAction<{
        id: string;
        selectedVariants: Record<string, string>;
      }>,
    ) => {
      const { id, selectedVariants } = action.payload;
      const item = state.items.find(
        (item) =>
          item.id === id &&
          variantsEqual(item.selectedVariants, selectedVariants),
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    // Alternative methods that work with cart item index (for easier UI integration)
    increaseQuantityByIndex: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (state.items[index]) {
        state.items[index].quantity += 1;
      }
    },

    decreaseQuantityByIndex: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (state.items[index] && state.items[index].quantity > 1) {
        state.items[index].quantity -= 1;
      }
    },

    removeFromCartByIndex: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (state.items[index]) {
        state.items.splice(index, 1);
        toast.success("Item removed from cart", { position: "bottom-right" });
      }
    },

    // Update item variants (useful for cart editing)
    updateItemVariants: (
      state,
      action: PayloadAction<{
        index: number;
        newVariants: Record<string, string>;
      }>,
    ) => {
      const { index, newVariants } = action.payload;
      if (state.items[index]) {
        // Check if item with new variants already exists
        const existingItem = state.items.find(
          (item, idx) =>
            idx !== index &&
            item.id === state.items[index].id &&
            variantsEqual(item.selectedVariants, newVariants),
        );

        if (existingItem) {
          // Merge quantities and remove the updated item
          existingItem.quantity += state.items[index].quantity;
          state.items.splice(index, 1);
          toast.success("Cart updated - items merged", {
            position: "bottom-right",
          });
        } else {
          // Update variants
          state.items[index].selectedVariants = newVariants;
          toast.success("Item variants updated", { position: "bottom-right" });
        }
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
  increaseQuantityByIndex,
  decreaseQuantityByIndex,
  removeFromCartByIndex,
  updateItemVariants,
  clearCart,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartItemsCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce(
    (total, item) =>
      total + (item.discountedPrice || item.price) * item.quantity,
    0,
  );

// Helper function to get cart item display key (for UI)
export const getCartItemDisplayKey = (item: CartItem): string => {
  return generateCartItemKey(item.id, item.selectedVariants);
};

// Helper function to format variant selection for display
export const formatVariantsForDisplay = (
  variants: Record<string, string>,
): string => {
  return Object.entries(variants)
    .map(
      ([key, value]) =>
        `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`,
    )
    .join(", ");
};

export default cartSlice.reducer;
