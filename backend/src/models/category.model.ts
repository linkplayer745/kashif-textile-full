import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { Product } from './index';
import toJSON from './plugins/toJSON.plugin';
export interface ICategory {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  imagePublicId?: string;
}

export interface ICategoryDocument extends ICategory, Document {
  products?: Types.DocumentArray<Types.ObjectId>;
}

export interface ICategoryModel extends Model<ICategoryDocument> {
  findByName(name: string): Promise<ICategoryDocument | null>;
}

//
// 4) Schema definition, with timestamps & toJSON virtuals enabled
//
const categorySchema = new Schema<ICategoryDocument, ICategoryModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: { type: String, default: '' },
    imageUrl: { type: String },
    imagePublicId: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
});

categorySchema.statics.findByName = function (
  this: ICategoryModel,
  name: string,
) {
  return this.findOne({ name }).exec();
};

categorySchema.pre('deleteOne', async function (this: ICategoryDocument, next) {
  await Product.updateMany(
    { category: this._id },
    { $unset: { category: '' } },
  );
  next();
});

categorySchema.plugin(toJSON);

export const Category = mongoose.model<ICategoryDocument, ICategoryModel>(
  'Category',
  categorySchema,
);

export default Category;
