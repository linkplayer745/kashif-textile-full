// import { Request, Response, NextFunction } from 'express';
// import httpStatus from 'http-status';
// import ApiError from '../utils/apiError';
// import { tokenService } from '../services';

// const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       throw new ApiError(
//         httpStatus.UNAUTHORIZED,
//         'Authorization header missing or malformed',
//       );
//     }

//     const token = authHeader.split(' ')[1];
//     const payload = tokenService.verifyAccessToken(token);

//     if (!payload.role || payload.role !== 'admin') {
//       throw new ApiError(
//         httpStatus.UNAUTHORIZED,
//         'You are not authorized to access this route',
//       );
//     }

//     next();
//   } catch (err) {
//     next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
//   }
// };

// export default adminAuth;

import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import ApiError from '../utils/apiError';
import { tokenService } from '../services';
import jwt from 'jsonwebtoken';

const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
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

    if (payload.role !== 'admin') {
      throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
    }

    next();
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'TokenExpired'));
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'InvalidToken'));
    }

    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
  }
};
export default adminAuth;
