import ApiError from '../utils/apiError';
import tokenService from './token.service';
import httpStatus from 'http-status';
import { config } from '../config/config';

const ADMIN = {
  userId: 'admin',
  email: config.adminEmail,
};
const loginUserWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  if (email !== config.adminEmail || password !== config.adminPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  const token = await tokenService.generateAccessToken(ADMIN.userId, 'admin');
  return token;
};

export default {
  loginUserWithEmailAndPassword,
};
