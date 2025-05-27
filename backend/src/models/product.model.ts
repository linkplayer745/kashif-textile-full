// // src/models/product.model.ts
// import mongoose, { Document, Model } from 'mongoose';

// export interface IVariantOption {
//   name: string;
//   code?: string;
// }

// // 2. Define Product document interface
// export interface IProduct {
//   categoryId: mongoose.Schema.Types.ObjectId;
//   name: string;
//   price: number;
//   discountedPrice?: number;
//   description: string;
//   attributes: Record<string, string>;
//   variants: {
//     colors: IVariantOption[];
//     fits?: IVariantOption[];
//     sizes: IVariantOption[];
//   };
//   images: string[];
// }

// // Mongoose Document extends IProduct
// export interface IProductDocument extends IProduct, Document {}

// // Optional: define static methods interface
// export interface IProductModel extends Model<IProductDocument> {
//   seedInitialData(data: IProduct[]): Promise<void>;
// }

// // 3. Create VariantOption schema
// const variantOptionSchema = new mongoose.Schema<IVariantOption>(
//   {
//     name: { type: String, required: true },
//     code: { type: String },
//   },
//   { _id: false },
// );

// // 4. Create Product schema
// const productSchema = new mongoose.Schema<IProductDocument, IProductModel>(
//   {
//     categoryId: {
//       ref: 'Category',
//       type: mongoose.Schema.Types.ObjectId,
//     },
//     name: { type: String, required: true, trim: true, index: true },
//     price: { type: Number, required: true, min: 0 },
//     discountedPrice: { type: Number, min: 0 },
//     description: { type: String, default: '' },
//     attributes: { type: Map, of: String, default: {} },
//     variants: {
//       colors: { type: [variantOptionSchema], default: [] },
//       fits: { type: [variantOptionSchema], default: [] },
//       sizes: { type: [variantOptionSchema], default: [] },
//     },
//     images: { type: [String], default: [] },
//   },
//   { timestamps: true },
// );

// // // 5. Static method to seed initial data
// // productSchema.statics.seedInitialData = async function (data: IProduct[]) {
// //   const count = await this.countDocuments();
// //   if (count === 0) {
// //     await this.insertMany(data);
// //   }
// // };

// // 6. Create and export model
// const Product = mongoose.model<IProductDocument, IProductModel>(
//   'Product',
//   productSchema,
// );

// export default Product;

import mongoose, { Document, Model } from 'mongoose';
import toJSON from './plugins/toJSON.plugin';

// Interface for a single variant option
export interface IVariantOption {
  name: string;
  code?: string;
}

// Main Product interface
export interface IProduct {
  categoryId: mongoose.Schema.Types.ObjectId;
  name: string;
  price: number;
  discountedPrice?: number;
  description: string;
  attributes: Record<string, string>;
  variants: Record<string, IVariantOption[]>; // Flexible variant keys
  images: string[];
}

// Mongoose Document and Model interfaces
export interface IProductDocument extends IProduct, Document {}
export interface IProductModel extends Model<IProductDocument> {
  seedInitialData(data: IProduct[]): Promise<void>;
}

// Schema for a single variant option
const variantOptionSchema = new mongoose.Schema<IVariantOption>(
  {
    name: { type: String, required: true },
    code: { type: String },
  },
  { _id: false },
);

// Product Schema
const productSchema = new mongoose.Schema<IProductDocument, IProductModel>(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      unique: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountedPrice: {
      type: Number,
      min: 0,
    },
    description: {
      type: String,
      default: '',
    },
    attributes: {
      type: Map,
      of: String,
      default: {},
    },
    variants: {
      type: Map,
      of: [variantOptionSchema], // Each variant is an array of variant options
      default: {},
    },
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);
productSchema.statics.seedInitialData = async function (data: IProduct[]) {
  const count = await this.countDocuments();
  if (count === 0) {
    await this.insertMany(data);
  }
};

productSchema.plugin(toJSON);
// Model export
const Product = mongoose.model<IProductDocument, IProductModel>(
  'Product',
  productSchema,
);

export default Product;
