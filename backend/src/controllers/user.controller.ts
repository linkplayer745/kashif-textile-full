import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import userService from '../services/user.service';
import { AuthenticatedRequest } from '../middlewares/auth';

const updateUserDetails = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const user = await userService.updateUserDetails(userId, req.body);

    res.status(httpStatus.OK).json({
      success: true,
      message: 'User details updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        details: user.details,
      },
    });
  },
);

const getUserProfile = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const userDetails = await userService.getUserDetails(userId);

    res.status(httpStatus.OK).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: userDetails,
    });
  },
);

export default {
  updateUserDetails,
  getUserProfile,
};
