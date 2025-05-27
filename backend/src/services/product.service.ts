import Product from '../models/product.model';
import { IProduct } from '../models/product.model';
import httpStatus from 'http-status';
import ApiError from '../utils/apiError';
import cloudinaryService from './cloudinary.service';

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

  const imageUploadPromises = imageBuffers.map((file) =>
    cloudinaryService.uploadToCloudinary(file.buffer, 'products'),
  );

  const uploadedImages = await Promise.all(imageUploadPromises);
  const imageUrls = uploadedImages.map((img: any) => img.secure_url);

  const product = await Product.create({
    ...productData,
    images: imageUrls,
  });

  return product;
};

export default {
  addProduct,
};
