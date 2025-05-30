import mongoose, { Document, Model } from 'mongoose';
import toJSON from './plugins/toJSON.plugin';
import paginate from './plugins/pagination.plugin';

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
  slug: string;
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
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>,
  ): Promise<Record<string, any>>;
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
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[a-z0-9-]+$/,
      trim: true,
      index: true,
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
productSchema.plugin(paginate);

// Model export
const Product = mongoose.model<IProductDocument, IProductModel>(
  'Product',
  productSchema,
);

export default Product;
