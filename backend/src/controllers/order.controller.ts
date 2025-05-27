import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '../middlewares/auth';
import { orderService } from '../services';

const createOrder = catchAsync(
  async (req: Request | AuthenticatedRequest, res: Response) => {
    // req.body now includes all shipping fields + items + shippingCost
    const dto = req.body;
    // If the auth middleware ran and set req.userId, pick it up:
    if ('userId' in req && req.userId) {
      dto.userId = req.userId;
    }
    const order = await orderService.createOrder(dto);
    res.status(httpStatus.CREATED).send({ order });
  },
);

const getOrdersByUserId = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req?.user?.id;
    const orders = await orderService.getOrdersByUserId(userId);
    res.status(httpStatus.OK).send({ orders });
  },
);

const getOrders = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const orders = await orderService.getOrders();
    res.status(httpStatus.OK).send({ orders });
  },
);
const orderController = {
  getOrders,
  createOrder,
  getOrdersByUserId,
};

export default orderController;
