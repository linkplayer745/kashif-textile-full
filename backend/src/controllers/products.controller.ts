import { productService } from '../services';
import catchAsync from '../utils/catchAsync';
import httpStatus from 'http-status';

const getProducts = catchAsync(async (req, res) => {
  const result = await productService.getProducts(req);
  res.status(httpStatus.OK).send(result);
});

const getProductByCategory = catchAsync(async (req, res) => {
  const result = await productService.getProductByCategory(req);
  res.status(httpStatus.OK).send(result);
});

const getProductBySlug = catchAsync(async (req, res) => {
  const product = await productService.getProductBySlug(req);
  res.status(httpStatus.OK).send(product);
});
const productsController = {
  getProductBySlug,
  getProductByCategory,
  getProducts,
};

export default productsController;
