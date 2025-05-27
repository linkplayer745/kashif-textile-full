import mongoose from 'mongoose';
import toJSON from './plugins/toJSON.plugin';
const { Schema } = mongoose;

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  selectedVariant?: Record<string, string>;
}

export interface ICartDocument extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 },
    selectedVariant: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { _id: false },
);

const cartSchema = new Schema<ICartDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  },
);

cartSchema.plugin(toJSON);

const Cart = mongoose.model<ICartDocument>('Cart', cartSchema);
export default Cart;
