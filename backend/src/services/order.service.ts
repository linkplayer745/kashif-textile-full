// src/services/order.service.ts
import { Types } from 'mongoose';
import { Order, IOrderDocument } from '../models/order.model';
import Product, { IProductDocument } from '../models/product.model';
import ApiError from '../utils/apiError';
import httpStatus from 'http-status';

export interface CreateOrderDto {
  userId?: string;
  // shipping fields
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

  items: Array<{
    product: string;
    quantity: number;
    selectedVariant?: Record<string, string>;
  }>;
  // shippingCost: number;
}

const createOrder = async (dto: CreateOrderDto): Promise<IOrderDocument> => {
  const { items, userId, ...shipping } = dto;
  const shippingCost = 200;
  // 1) Fetch all product docs in one go
  const productIds = Array.from(
    new Set(items.map((i) => new Types.ObjectId(i.product))),
  );
  const products = await Product.find({
    _id: { $in: productIds },
  });

  // 2) Ensure all requested products exist
  if (products.length !== productIds.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'One or more products not found',
    );
  }

  const orderItems = items.map((i) => {
    const prodDoc = products.find((p) =>
      (p._id as Types.ObjectId).equals(i.product),
    )!;
    return {
      product: prodDoc._id,
      name: prodDoc.name,
      price: prodDoc?.discountedPrice ?? prodDoc.price,
      quantity: i.quantity,
      selectedVariant: i.selectedVariant || {},
    };
  });

  const subTotal = orderItems.reduce(
    (sum, it) => sum + it.price * it.quantity,
    0,
  );
  const total = subTotal + shippingCost;

  // 5) Assemble payload
  const payload: any = {
    items: orderItems,
    shipping: shipping, // nested shipping fields
    subTotal,
    shippingCost,
    total,
  };

  if (userId) {
    payload.user = new Types.ObjectId(userId);
  }

  return Order.create(payload);
};

const getOrdersByUserId = async (userId: string): Promise<IOrderDocument[]> => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid userId');
  }

  const objectId = new Types.ObjectId(userId);

  const orders = await Order.find({ user: objectId }).sort({ createdAt: -1 });
  console.log('orders', orders);
  return orders;
};

const getOrders = async (): Promise<IOrderDocument[]> => {
  const orders = await Order.find().sort({ createdAt: -1 });
  return orders;
};

// const updateOrderStatus = async (
//   orderId: string,
//   status: OrderStatus,
// ): Promise<IOrderDocument> => {
//   const order = await Order.findById(orderId);
//   if (!order) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
//   }
//   order.status = status;
//   await order.save();
//   return order;
// };

export default {
  getOrders,
  createOrder,
  getOrdersByUserId,
};
