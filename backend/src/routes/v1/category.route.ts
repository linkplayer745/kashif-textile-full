import express from 'express';
import { memoryUpload } from '../../middlewares/upload';
import { validate } from '../../middlewares/validate';
import categoryValidation from '../../validations/category.validation';
import categoryController from '../../controllers/category.controller';
import adminAuth from '../../middlewares/adminAuth';

const router = express.Router();

router.post(
  '/',
  adminAuth,
  validate(categoryValidation.addCategory),
  memoryUpload.single('image'),
  categoryController.addCategory,
);

router.get('/all', categoryController.getCategories);

router
  .route('/:categoryId')
  .patch(
    adminAuth,
    validate(categoryValidation.updateCategory),
    memoryUpload.single('image'),
    categoryController.updateCategory,
  )
  .delete(adminAuth, categoryController.deleteCategory);

export default router;
