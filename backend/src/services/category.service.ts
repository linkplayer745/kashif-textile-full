import { Category } from '../models';
import { pick } from '../utils/pick';
import { AddCategoryRequest } from '../validations/category.validation';
import cloudinaryService from './cloudinary.service';
import { Request } from 'express';
const addCategory = async (payload: AddCategoryRequest) => {
  const category = await Category.create(payload);
  return category;
};

const getCategories = async (filter: object, options: object) => {
  const categories = await Category.paginate(filter, options);
  return categories;
};

const deleteCategory = async (id: string) => {
  const category = await Category.findByIdAndDelete(id);
  console.log('deleted ', category);
  return category;
};

const updateCategory = async (
  id: string,
  payload: AddCategoryRequest,
  imageFile?: Express.Multer.File,
) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new Error('Category not found');
  }

  // Update basic fields
  if (payload.name) category.name = payload.name;
  if (payload.slug) category.slug = payload.slug;
  if (payload.description) category.description = payload.description;

  // Handle image replacement if a new image is uploaded
  if (imageFile) {
    // Delete old image from Cloudinary
    if (category.imagePublicId) {
      await cloudinaryService.deleteImage(category.imagePublicId);
    }

    // Upload new image to Cloudinary
    const { public_id, secure_url } =
      await cloudinaryService.uploadToCloudinary(
        imageFile.buffer,
        'categories',
      );

    category.imageUrl = secure_url;
    category.imagePublicId = public_id;
  }

  await category.save();
  return category;
};

export default {
  updateCategory,
  addCategory,
  getCategories,
  deleteCategory,
};
