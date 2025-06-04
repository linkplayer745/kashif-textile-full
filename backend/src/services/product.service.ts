import Product, { UpdateProductRequest } from '../models/product.model';
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
  updateData: Partial<UpdateProductRequest>,
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

  // Parse attributes if it's a string
  if (typeof updateData.attributes === 'string') {
    try {
      updateData.attributes = JSON.parse(updateData.attributes);
    } catch (error) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid attributes format');
    }
  }

  // Parse variants if it's a string
  if (typeof updateData.variants === 'string') {
    try {
      updateData.variants = JSON.parse(updateData.variants);
    } catch (error) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid variants format');
    }
  }

  if (updateData.discountedPrice === 'null') {
    updateData.discountedPrice = null;
  }
  // Handle existing images parsing more safely
  let existingImages: string[] = [];
  if (updateData?.existingImages) {
    if (Array.isArray(updateData.existingImages)) {
      // Already an array
      existingImages = updateData.existingImages;
    } else if (typeof updateData.existingImages === 'string') {
      try {
        // Try to parse as JSON first
        const parsed = JSON.parse(updateData.existingImages);
        existingImages = Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        // If JSON parsing fails, treat as comma-separated string
        existingImages = updateData.existingImages
          .split(',')
          .map((url) => url.trim())
          .filter((url) => url.length > 0);
      }
    }
  }

  // Handle image updates
  if (imageBuffers && imageBuffers.length > 0) {
    // Upload new images
    const uploadedImages = await Promise.all(
      imageBuffers.map((file) =>
        cloudinaryService.uploadToCloudinary(file.buffer, 'products'),
      ),
    );

    const newImageUrls = uploadedImages.map((img) => img.secure_url);

    // Combine existing images (that user wants to keep) with new uploaded images
    updateData.images = [...existingImages, ...newImageUrls];

    // Delete images that are no longer needed
    const imagesToDelete = product.images.filter(
      (url) => !existingImages.includes(url),
    );

    await Promise.all(
      imagesToDelete.map(async (url) => {
        const publicIdMatch = url.match(/\/([^/]+)\.\w+$/);
        if (publicIdMatch) {
          const publicId = `products/${publicIdMatch[1]}`;
          await cloudinaryService.deleteImage(publicId);
        }
      }),
    );
  } else if (existingImages.length > 0) {
    // If no new images but existing images are specified, just keep the existing ones
    updateData.images = existingImages;

    // Delete images that are no longer needed
    const imagesToDelete = product.images.filter(
      (url) => !existingImages.includes(url),
    );

    await Promise.all(
      imagesToDelete.map(async (url) => {
        const publicIdMatch = url.match(/\/([^/]+)\.\w+$/);
        if (publicIdMatch) {
          const publicId = `products/${publicIdMatch[1]}`;
          await cloudinaryService.deleteImage(publicId);
        }
      }),
    );
  }

  // Remove existingImages from updateData as it's not a product field
  delete updateData.existingImages;

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
  const ids = (req.query.ids as string)?.split(',') || [];

  const categoryFilter = categoryId ? { categoryId } : {};
  const idsFilter = ids.length > 0 ? { _id: { $in: ids } } : {};

  const filter = { ...nameFilter, ...categoryFilter, ...idsFilter };

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
