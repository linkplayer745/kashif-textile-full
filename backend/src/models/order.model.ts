// src/models/order.model.ts

import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import toJSON from './plugins/toJSON.plugin';
import paginate from './plugins/pagination.plugin';

//
// 1. Sub-schemas & interfaces
//

// Order line item snapshot
export interface IOrderItem {
  product: Types.ObjectId;
  name: string; // product name at time of order
  price: number; // unit price
  quantity: number;
  selectedVariant?: Record<string, string>;
}

// Shipping fields (always present)
export interface IShipping {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  state?: string;
  city: string;
  postalCode?: string;
  address1: string;
  address2?: string;
  shipToBilling: boolean;
  orderNotes?: string;
}
export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'shipped'
  | 'completed'
  | 'cancelled';

// Main order document
export interface IOrder {
  user?: Types.ObjectId; // if logged in
  // guest just fills shipping fields above
  items: IOrderItem[];
  shipping: IShipping;
  subTotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
}

export interface IOrderDocument extends IOrder, Document {}
export interface IOrderModel extends Model<IOrderDocument> {
  paginate(filter: Record<string, any>, options: Record<string, any>): any;
}

//
// 2. Define sub-schemas
//

// Order item sub-schema
const orderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    selectedVariant: { type: Map, of: String },
  },
  { _id: false },
);

// Shipping sub-schema (used as a nested doc under `shipping`)
const shippingSchema = new Schema<IShipping>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String },
    city: { type: String, required: true },
    postalCode: { type: String },
    address1: { type: String, required: true },
    address2: { type: String },
    shipToBilling: { type: Boolean, default: true },
    orderNotes: { type: String },
  },
  { _id: false },
);

//
// 3. Main Order schema
//

const orderSchema = new Schema<IOrderDocument, IOrderModel>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    items: { type: [orderItemSchema], required: true },
    shipping: { type: shippingSchema, required: true },
    subTotal: { type: Number, required: true, min: 0 },
    shippingCost: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
);
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

export const Order = mongoose.model<IOrderDocument, IOrderModel>(
  'Order',
  orderSchema,
);
