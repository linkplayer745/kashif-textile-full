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
    const status = req.query.status as string;
    const statusFilter = status ? { status } : {};
    const filters = {
      user: userId,
      ...statusFilter,
    };

    const options = pick(req.query, ['sortBy', 'limit', 'page']);

    const orders = await orderService.getOrdersByUserId(filters, options);
    res.status(httpStatus.OK).send(orders);
  },
);

const getOrders = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req?.query?.id as string;
    const status = req.query.status as string;
    const statusFilter = status ? { status } : {};
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const filters = {
      ...(userId &&
        Types.ObjectId.isValid(userId) && { user: new Types.ObjectId(userId) }),
      ...statusFilter,
    };

    const orders = await orderService.getOrders(filters, options);
    res.status(httpStatus.OK).send(orders);
  },
);
const orderController = {
  getOrders,
  createOrder,
  getOrdersByUserId,
};

export default orderController;
