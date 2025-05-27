import express from 'express';
import auth from '../../middlewares/auth';
import { memoryUpload } from '../../middlewares/upload';
import { validate } from '../../middlewares/validate';
import categoryValidation from '../../validations/category.validation';
import categoryController from '../../controllers/category.controller';

const router = express.Router();

router.post(
  '/',
  auth,
  validate(categoryValidation.addCategory),
  memoryUpload.single('image'),
  categoryController.addCategory,
);

router.get('/', categoryController.getCategories);
router.delete('/:categoryId', auth, categoryController.deleteCategory);

export default router;
