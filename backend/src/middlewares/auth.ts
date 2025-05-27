import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import ApiError from '../utils/apiError';
import { tokenService } from '../services';
import { User } from '../models';
import { IUserDocument } from '../models/user.model';

interface AuthenticatedRequest extends Request {
  user?: IUserDocument;
}

const auth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'Authorization header missing or malformed',
      );
    }

    const token = authHeader.split(' ')[1];
    const payload = tokenService.verifyAccessToken(token);

    if (!payload.sub) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token payload');
    }

    const userId = payload.sub;

    console.log('THe user id in payload ', userId);
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

export default auth;
export type { AuthenticatedRequest };
