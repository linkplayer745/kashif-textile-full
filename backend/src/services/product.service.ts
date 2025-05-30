import Product from '../models/product.model';
import { IProduct } from '../models/product.model';
import httpStatus from 'http-status';
import ApiError from '../utils/apiError';
import cloudinaryService from './cloudinary.service';
import { Category } from '../models';
import { Request } from 'express';

const addProduct = async (
  productData: Omit<IProduct, 'images'>,
  imageBuffers: Express.Multer.File[],
) => {
  if (!imageBuffers || imageBuffers.length === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'At least one image is required',
    );
  }
  if (productData.categoryId) {
    const categoryExists = await Category.findById(productData.categoryId);
    if (!categoryExists) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid category ID');
    }
  }
  if (typeof productData.attributes === 'string') {
    productData = {
      ...productData,
      attributes: JSON.parse(productData.attributes as unknown as string),
    };
  }

  if (typeof productData.variants === 'string') {
    productData = {
      ...productData,
      variants: JSON.parse(productData.variants as unknown as string),
    };
  }
  let uploadedImages: { public_id: string; secure_url: string }[] = [];

  try {
    uploadedImages = await Promise.all(
      imageBuffers.map((file) =>
        cloudinaryService.uploadToCloudinary(file.buffer, 'products'),
      ),
    );

    const imageUrls = uploadedImages.map((img) => img.secure_url);

    const product = await Product.create({
      ...productData,
      images: imageUrls,
    });

    return product;
  } catch (error) {
    if (uploadedImages.length > 0) {
      await Promise.all(
        uploadedImages.map((img) =>
          cloudinaryService.deleteImage(img.public_id),
        ),
      );
    }
    console.log(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create product. Cleanup performed.',
    );
  }
};
const updateProduct = async (
  productId: string,
  updateData: Partial<IProduct>,
  imageBuffers?: Express.Multer.File[],
) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  if (updateData.categoryId) {
    const categoryExists = await Category.findById(updateData.categoryId);
    if (!categoryExists) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid category ID');
    }
  }

  if (typeof updateData.attributes === 'string') {
    updateData.attributes = JSON.parse(
      updateData.attributes as unknown as string,
    );
  }
  if (typeof updateData.variants === 'string') {
    updateData = {
      ...updateData,
      variants: JSON.parse(updateData.variants as unknown as string),
    };
  }
  if (imageBuffers && imageBuffers.length > 0) {
    const uploadedImages = await Promise.all(
      imageBuffers.map((file) =>
        cloudinaryService.uploadToCloudinary(file.buffer, 'products'),
      ),
    );

    const newImageUrls = uploadedImages.map((img) => img.secure_url);

    await Promise.all(
      product.images.map(async (url) => {
        const publicIdMatch = url.match(/\/([^/]+)\.\w+$/);
        if (publicIdMatch) {
          const publicId = `products/${publicIdMatch[1]}`;
          await cloudinaryService.deleteImage(publicId);
        }
      }),
    );

    updateData.images = newImageUrls;
  }

  // Update the product document
  Object.assign(product, updateData);
  await product.save();

  return product;
};

import { pick } from '../utils/pick';

const getProducts = async (req: Request) => {
  const searchTerm = req.query.searchTerm as string;
  const nameFilter = searchTerm
    ? { name: { $regex: new RegExp(searchTerm, 'i') } }
    : {};
  const categoryId = req.query.categoryId as string;

  const categoryFilter = categoryId ? { categoryId } : {};

  const filter = { ...nameFilter, ...categoryFilter };

  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await Product.paginate(filter, options);
  return result;
};

const getProductByCategory = async (req: Request) => {
  const slug = req.params.category;
  const searchTerm = req.query.searchTerm as string;
  const nameFilter = searchTerm
    ? { name: { $regex: new RegExp(searchTerm, 'i') } }
    : {};
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const category = await Category.findOne({ slug });
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  const products = await Product.paginate(
    { categoryId: category._id, ...nameFilter },
    options,
  );
  return products;
};
const deleteProduct = async (productId: string) => {
  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  return product;
};

const getProductBySlug = async (req: Request) => {
  const slug = req.params.slug;
  const product = await Product.findOne({ slug });
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  return product;
};

export default {
  getProductBySlug,
  getProductByCategory,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
