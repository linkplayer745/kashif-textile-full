import catchAsync from '../utils/catchAsync';

import { Request, Response } from 'express';
import ApiError from '../utils/apiError';
import httpStatus from 'http-status';
import { categoryService, cloudinaryService } from '../services';
import { pick } from '../utils/pick';

export const addCategory = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Image file is required');
  }

  const { public_id, secure_url } = await cloudinaryService.uploadToCloudinary(
    req.file.buffer,
    'categories',
  );

  const payload = {
    ...req.body,
    imageUrl: secure_url,
    imagePublicId: public_id,
  };

  const category = await categoryService.addCategory(payload);

  res.status(httpStatus.CREATED).send(category);
});

const getCategories = catchAsync(async (req: Request, res: Response) => {
  const searchTerm = req.query.searchTerm as string;
  const nameFilter = searchTerm
    ? { name: { $regex: new RegExp(searchTerm, 'i') } }
    : {};

  const filter = { ...nameFilter };

  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const categories = await categoryService.getCategories(filter, options);
  res.status(httpStatus.OK).send(categories);
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  const category = await categoryService.deleteCategory(categoryId);
  res.status(httpStatus.OK).send({
    category,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const payload = req.body;
  const imageFile = req.file;

  const category = await categoryService.updateCategory(
    categoryId,
    payload,
    imageFile,
  );

  res.status(httpStatus.OK).send(category);
});

const categoryController = {
  updateCategory,
  addCategory,
  getCategories,
  deleteCategory,
};
export default categoryController;
