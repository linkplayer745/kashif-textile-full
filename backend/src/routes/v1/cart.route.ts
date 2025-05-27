import express from 'express';
import auth from '../../middlewares/auth';
import cartController from '../../controllers/cart.controller';
import { validate } from '../../middlewares/validate';
import cartValidation from '../../validations/cart.validation';

const router = express.Router();

router.get('/', auth, cartController.getCart);

router.post(
  '/',
  auth,
  validate(cartValidation.addToCart),
  cartController.addToCart,
);

router.delete(
  '/remove-item-from-cart',
  auth,
  validate(cartValidation.removeFromCart),
  cartController.removeFromCart,
);

router.put(
  '/update-quantity',
  auth,
  validate(cartValidation.updateQuantity),
  cartController.updateItemQuantity,
);

router.delete('/clear-cart', auth, cartController.clearCart);

export default router;
