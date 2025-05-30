import { adminService, productService } from '../services';
import catchAsync from '../utils/catchAsync';
import httpStatus from 'http-status';

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const token = await adminService.loginUserWithEmailAndPassword(
    email,
    password,
  );

  res.status(httpStatus.OK).send({ token });
});

const addProduct = catchAsync(async (req, res) => {
  const productData = req.body;
  const files = req.files as Express.Multer.File[];

  const product = await productService.addProduct(productData, files);

  res.status(httpStatus.CREATED).send(product);
});

const updateProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const updateData = req.body;
  const imageBuffers = req.files as Express.Multer.File[];

  const updatedProduct = await productService.updateProduct(
    productId,
    updateData,
    imageBuffers,
  );

  res.status(httpStatus.OK).json(updatedProduct);
});

const getProducts = catchAsync(async (req, res) => {
  const result = await productService.getProducts(req);
  res.status(httpStatus.OK).send(result);
});

const deleteProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const deletedProduct = await productService.deleteProduct(productId);
  res.status(httpStatus.OK).json(deletedProduct);
});
const adminController = {
  login,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};

export default adminController;
