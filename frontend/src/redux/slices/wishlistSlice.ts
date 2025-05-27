import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";

type WishlistState = {
  productId: number[];
};

const initialState: WishlistState = {
  productId: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<number>) {
      if (!state.productId.includes(action.payload)) {
        state.productId.push(action.payload);
      }

      toast.success("Item added to wishlist", {
        action: {
          label: "View wishlist",
          onClick: () => {
            window.location.href = "/wishlist";
          },
        },
      });
    },
    removeFromWishlist(state, action: PayloadAction<number>) {
      state.productId = state.productId.filter((id) => id !== action.payload);

      toast.success("Item removed from wishlist");
    },
    clearWishlist(state) {
      state.productId = [];
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
