import express from 'express';
import { validate } from '../../middlewares/validate';
import orderValidation from '../../validations/order.validation';
import orderController from '../../controllers/order.controller';
import auth from '../../middlewares/auth';
import optionalAuth from '../../middlewares/optionalAuth';
import adminAuth from '../../middlewares/adminAuth';

const router = express.Router();

router
  .route('/')
  .post(
    validate(orderValidation.createOrder),
    optionalAuth,
    orderController.createOrder,
  )
  .get(adminAuth, orderController.getOrders);

router.get('/user-orders', auth, orderController.getOrdersByUserId);

export default router;
