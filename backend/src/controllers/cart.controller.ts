import { AuthenticatedRequest } from '../middlewares/auth';
import { cartService } from '../services';
import catchAsync from '../utils/catchAsync';

const addToCart = catchAsync(async (req: AuthenticatedRequest, res) => {
  const userId = req?.user?.id;
  const { productId, quantity, selectedVariant } = req.body;
  const cart = await cartService.addToCart(
    userId,
    productId,
    selectedVariant,
    quantity,
  );

  res.status(201).send({ cart });
});

const removeFromCart = catchAsync(async (req: AuthenticatedRequest, res) => {
  const userId = req?.user?.id;
  const { productId, selectedVariant } = req.body;
  const cart = await cartService.removeFromCart(
    userId,
    productId,
    selectedVariant,
  );
  res.status(200).send({ cart });
});

const getCart = catchAsync(async (req: AuthenticatedRequest, res) => {
  const userId = req?.user?.id;
  const cart = await cartService.getCart(userId);
  res.status(200).send({ cart });
});

const updateItemQuantity = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const userId = req?.user?.id;
    const { productId, selectedVariant, quantity } = req.body;
    await cartService.updateItemQuantity(
      userId,
      productId,
      selectedVariant,
      quantity,
    );
    res.status(200).send(true);
  },
);

const clearCart = catchAsync(async (req: AuthenticatedRequest, res) => {
  const userId = req?.user?.id;
  await cartService.clearCart(userId);
  res.status(200).send(true);
});
const cartController = {
  getCart,
  addToCart,
  removeFromCart,
  updateItemQuantity,
  clearCart,
};
export default cartController;
