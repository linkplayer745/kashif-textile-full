import catchAsync from '../utils/catchAsync';

import { Request, Response } from 'express';
import ApiError from '../utils/apiError';
import httpStatus from 'http-status';
import { categoryService, cloudnaryService } from '../services';

export const addCategory = catchAsync(async (req: Request, res: Response) => {
  // const { name, slug, description } = req.body;
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Image file is required');
  }

  const { public_id, secure_url } = await cloudnaryService.uploadToCloudinary(
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
  const categories = await categoryService.getCategories();
  res.status(httpStatus.OK).send({
    categories,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  const category = await categoryService.deleteCategory(categoryId);
  res.status(httpStatus.OK).send({
    category,
  });
});
const categoryController = {
  addCategory,
  getCategories,
  deleteCategory,
};
export default categoryController;
