import { Response } from 'express';
import { tokenService, userService, authService } from '../services';
import catchAsync from '../utils/catchAsync';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '../middlewares/auth';

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const token = await tokenService.generateAccessToken(user.id);
  res.status(httpStatus.CREATED).send({ user, token });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const token = await tokenService.generateAccessToken(user.id);

  res.send({ user, token });
});

const changePassword = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const { password, newPassword } = req.body;
    await userService.changePassoword({ userId, password, newPassword });
    res.status(httpStatus.OK).send(true);
  },
);

const authController = {
  register,
  login,
  changePassword,
};

export default authController;
