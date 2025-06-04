// src/services/order.service.ts
import { Types } from 'mongoose';
import { Order, IOrderDocument, OrderStatus } from '../models/order.model';
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
}

const createOrder = async (
  dto: CreateOrderDto,
): Promise<IOrderDocument | undefined> => {
  const { items, userId, ...shipping } = dto;
  const shippingCost = 0;
  const productIds = items?.map((i) => i.product);
  const uniqueProductIds = [...new Set(productIds)];

  const products = await Product.find({ _id: { $in: uniqueProductIds } });

  if (products.length !== uniqueProductIds.length) {
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

const getOrdersByUserId = async (
  filters: object,
  options: object,
): Promise<IOrderDocument[]> => {
  const orders = await Order.paginate(filters, options);
  // .find({ user: objectId }).sort({ createdAt: -1 });
  return orders;
};

const getOrders = async (
  filters: object,
  options: object,
): Promise<IOrderDocument[]> => {
  // const orders = await Order.find().sort({ createdAt: -1 });
  const orders = await Order.paginate(filters, options);
  return orders;
};

const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
): Promise<IOrderDocument> => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  order.status = status;
  await order.save();
  return order;
};
const getUserOrderStats = async (userId: string | Types.ObjectId) => {
  // Ensure userId is an ObjectId
  const userObjectId =
    typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

  // Count total orders for this user
  const totalOrdersPromise = Order.countDocuments({
    user: userObjectId,
  }).exec();

  // Count only those orders with status "pending"
  const pendingOrdersPromise = Order.countDocuments({
    user: userObjectId,
    status: 'pending',
  }).exec();

  const [totalOrders, pendingOrders] = await Promise.all([
    totalOrdersPromise,
    pendingOrdersPromise,
  ]);

  return { totalOrders, pendingOrders };
};
export default {
  getOrders,
  createOrder,
  updateOrderStatus,
  getOrdersByUserId,
  getUserOrderStats,
};
