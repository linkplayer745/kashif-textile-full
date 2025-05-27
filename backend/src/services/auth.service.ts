import ApiError from '../utils/apiError';
import userService from './user.service';
import httpStatus from 'http-status';

const loginUserWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

export default {
  loginUserWithEmailAndPassword,
};
