import express from 'express';
import authValidation from '../../validations/auth.validation';
import { validate } from '../../middlewares/validate';
import adminController from '../../controllers/admin.controller';
import productValidation from '../../validations/product.validation';
import { memoryUpload } from '../../middlewares/upload';
import adminAuth from '../../middlewares/adminAuth';

const router = express.Router();

router.post('/login', validate(authValidation.login), adminController.login);

router.post(
  '/add-product',
  adminAuth,
  validate(productValidation.addProduct),
  memoryUpload.array('images'),
  adminController.addProduct,
);

router.patch(
  '/product/:productId',
  adminAuth,
  memoryUpload.array('images'),
  adminController.updateProduct,
);

router.get('/products', adminAuth, adminController.getProducts);
export default router;
