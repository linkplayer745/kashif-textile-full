import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '../middlewares/auth';
import { orderService } from '../services';
import { pick } from '../utils/pick';
import { Types } from 'mongoose';

const createOrder = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const dto = req.body;
    const userId = req?.user?.id;
    if (userId) {
      dto.userId = userId;
    }
    const order = await orderService.createOrder(dto);
    res.status(httpStatus.CREATED).send({ order });
  },
);

const getOrdersByUserId = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req?.user?.id;
    const orderId = req?.query?.orderId as string;
    const status = req.query.status as string;
    const statusFilter = status ? { status } : {};
    const filters: Record<string, any> = {};
    if (userId && Types.ObjectId.isValid(userId)) {
      filters.user = new Types.ObjectId(userId);
    }

    if (orderId && Types.ObjectId.isValid(orderId)) {
      filters._id = new Types.ObjectId(orderId);
    }

    Object.assign(filters, statusFilter);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);

    const orders = await orderService.getOrdersByUserId(filters, options);
    res.status(httpStatus.OK).send(orders);
  },
);

const getOrders = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req?.query?.id as string;
    const orderId = req?.query?.orderId as string;
    const status = req.query.status as string;
    const statusFilter = status ? { status } : {};
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const filters: Record<string, any> = {};

    if (orderId && Types.ObjectId.isValid(orderId)) {
      filters._id = new Types.ObjectId(orderId);
    }

    if (userId && Types.ObjectId.isValid(userId)) {
      filters.user = new Types.ObjectId(userId);
    }

    Object.assign(filters, statusFilter);

    const orders = await orderService.getOrders(filters, options);
    res.status(httpStatus.OK).send(orders);
  },
);

const updateOrderStatus = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(orderId, status);
    res.status(httpStatus.OK).send(order);
  },
);

const getUserOrderStats = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req?.user?.id;
    const orderStats = await orderService.getUserOrderStats(userId);
    res.status(httpStatus.OK).send(orderStats);
  },
);

const trackOrder = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const order = await orderService.trackOrder(orderId);
  res.status(httpStatus.OK).send(order);
});
const orderController = {
  updateOrderStatus,
  getOrders,
  createOrder,
  getOrdersByUserId,
  getUserOrderStats,
  trackOrder,
};

export default orderController;
