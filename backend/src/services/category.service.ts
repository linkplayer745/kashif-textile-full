import { Category } from '../models';
import { AddCategoryRequest } from '../validations/category.validation';

const addCategory = async (payload: AddCategoryRequest) => {
  const category = await Category.create(payload);
  return category;
};

const getCategories = async () => {
  const categories = await Category.find();
  return categories;
};

const deleteCategory = async (id: string) => {
  const category = await Category.findByIdAndDelete(id);
  console.log('deleted ', category);
  return category;
};

export default {
  addCategory,
  getCategories,
  deleteCategory,
};
