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
const createProduct = catchAsync(async (req, res) => {
  const productData = req.body;
  const files = req.files as Express.Multer.File[];

  const product = await productService.addProduct(productData, files);

  res.status(httpStatus.CREATED).send(product);
});
const adminController = {
  createProduct,
  login,
};

export default adminController;
