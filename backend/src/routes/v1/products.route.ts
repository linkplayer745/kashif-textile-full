import express from 'express';

import productsController from '../../controllers/products.controller';

const router = express.Router();

router.get('/', productsController.getProducts);
router.get('/get/:slug', productsController.getProductBySlug);
router.get('/:category', productsController.getProductByCategory);
export default router;
