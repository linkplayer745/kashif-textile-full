import ApiError from '../utils/apiError';
import httpStatus from 'http-status';
import {
  ChangePasswordRequest,
  RegisterRequest,
} from '../validations/auth.validation';
import User from '../models/user.model';

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

export default {
  createUser,
  getUserByEmail,
  changePassoword,
};
