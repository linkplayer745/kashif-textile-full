import express from 'express';
import { validate } from '../../middlewares/validate';
import orderValidation from '../../validations/order.validation';
import orderController from '../../controllers/order.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router
  .route('/')
  .post(validate(orderValidation.createOrder), orderController.createOrder)
  .get(auth, orderController.getOrders);

router.get('/user-orders', auth, orderController.getOrdersByUserId);

export default router;
