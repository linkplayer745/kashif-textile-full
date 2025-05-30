import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from './auth';
import ApiError from '../utils/apiError';
import { tokenService } from '../services';
import { User } from '../models';
import httpStatus from 'http-status';

const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader?.split(' ')[1];
    const payload = tokenService.verifyAccessToken(token!);

    if (!payload.sub) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token payload');
    }

    const userId = payload.sub;

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
    }

    req.user = user;
    next();
  } catch (err) {
    next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
  }
};

export default optionalAuth;
