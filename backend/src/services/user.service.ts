import ApiError from '../utils/apiError';
import httpStatus from 'http-status';
import {
  ChangePasswordRequest,
  RegisterRequest,
} from '../validations/auth.validation';
import User from '../models/user.model';
import { UpdateUserDetailsRequest } from '../validations/user.validation';

const createUser = async (userBody: RegisterRequest) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

const getUserByEmail = async (email: string) => {
  return User.findOne({ email });
};

const changePassoword = async ({
  userId,
  password,
  newPassword,
}: ChangePasswordRequest) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const isPasswordMatch = await user.isPasswordMatch(password);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect old password');
  }

  user.password = newPassword;
  await user.save();
  return user;
};
const updateUserDetails = async (
  userId: string,
  updateBody: UpdateUserDetailsRequest,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Update user fields
  if (updateBody.name !== undefined) {
    user.name = updateBody.name;
  }

  // Update details object
  user.details = {
    ...user.details,
    ...updateBody.details,
  };

  await user.save();
  return user;
};

const getUserById = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

const getUserDetails = async (userId: string) => {
  const user = await getUserById(userId);
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    details: user.details || {
      phone: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    },
  };
};

export default {
  createUser,
  getUserByEmail,
  changePassoword,
  updateUserDetails,
  getUserById,
  getUserDetails,
};
