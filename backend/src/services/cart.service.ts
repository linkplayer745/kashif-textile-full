import mongoose from 'mongoose';
import Cart, { ICartDocument } from '../models/cart.model';
import ApiError from '../utils/apiError';
import httpStatus from 'http-status';
/**
 * Adds a product to the user's cart or increases the quantity if it already exists.
 */
const addToCart = async (
  userId: string,
  productId: string,
  selectedVariant: Record<string, string> = {},
  quantity = 1,
): Promise<ICartDocument> => {
  const cart = await Cart.findOne({ user: userId });

  if (cart) {
    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        JSON.stringify(item.selectedVariant) ===
          JSON.stringify(selectedVariant),
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: new mongoose.Types.ObjectId(productId),
        quantity,
        selectedVariant,
      });
    }

    await cart.save();

    return cart;
  }

  // Create new cart
  const newCart = new Cart({
    user: new mongoose.Types.ObjectId(userId),
    items: [
      {
        product: new mongoose.Types.ObjectId(productId),
        quantity,
        selectedVariant,
      },
    ],
  });

  await newCart.save();
  return newCart;
};

/**
 * Decreases the quantity of an item from the user's cart. Removes it if quantity reaches 0.
 */
// export const decreaseItemFromCart = async (
//   userId: string,
//   productId: string,
//   selectedVariant: Record<string, string> = {},
// ): Promise<ICartDocument | null> => {
//   const cart = await Cart.findOne({ user: userId });

//   if (!cart) return null;

//   const itemIndex = cart.items.findIndex(
//     (item) =>
//       item.product.toString() === productId &&
//       JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant),
//   );

//   if (itemIndex > -1) {
//     const item = cart.items[itemIndex];
//     if (item.quantity > 1) {
//       item.quantity -= 1;
//     } else {
//       cart.items.splice(itemIndex, 1); // Remove item completely
//     }

//     await cart.save();
//     return cart;
//   }

//   return null;
// };

const updateItemQuantity = async (
  userId: string,
  productId: string,
  selectedVariant: Record<string, string> = {},
  newQuantity: number,
): Promise<ICartDocument | null> => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return null;

  const itemIndex = cart.items.findIndex(
    (item) =>
      item.product.toString() === productId &&
      JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant),
  );
  if (itemIndex === -1) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Item with product ID ${productId} and selected variant ${JSON.stringify(
        selectedVariant,
      )} not found in cart`,
    );
  }
  if (itemIndex > -1) {
    if (newQuantity > 0) {
      cart.items[itemIndex].quantity = newQuantity;
    } else {
      cart.items.splice(itemIndex, 1); // remove item if quantity is 0 or less
    }

    await cart.save();
    return cart;
  }

  return null;
};

/**
 * Removes a specific item completely from the cart.
 */
export const removeFromCart = async (
  userId: string,
  productId: string,
  selectedVariant: Record<string, string> = {},
): Promise<ICartDocument | null> => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return null;

  const originalLength = cart.items.length;

  cart.items = cart.items.filter(
    (item) =>
      item.product.toString() !== productId ||
      JSON.stringify(item.selectedVariant || {}) !==
        JSON.stringify(selectedVariant),
  );

  // If nothing was removed
  if (cart.items.length === originalLength) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Item with product ID ${productId} and selected variant ${JSON.stringify(
        selectedVariant,
      )} not found in cart`,
    );
  }

  await cart.save();
  return cart;
};

/**
 * Clears the entire cart (optional).
 */
const clearCart = async (userId: string): Promise<ICartDocument | null> => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return null;

  cart.items = [];
  await cart.save();
  return cart;
};

const getCart = async (userId: string): Promise<ICartDocument | null> => {
  const cart = await Cart.findOne({ user: userId });
  return cart;
};
export default {
  getCart,
  addToCart,
  // decreaseItemFromCart,
  updateItemQuantity,
  removeFromCart,
  clearCart,
};
