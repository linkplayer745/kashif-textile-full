import Joi from 'joi';
import { password } from './custom.validation';

export const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    // role: Joi.string().valid(['user', 'admin']).default('user'),
  }),
};

export type RegisterRequest = {
  email: string;
  password: string;
  name: string;
  // role: 'user' | 'admin';
};
export const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export type LoginRequest = {
  email: string;
  password: string;
};

export const changePassword = {
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
    newPassword: Joi.string().required().custom(password),
  }),
};

export type ChangePasswordRequest = {
  userId?: string;
  password: string;
  newPassword: string;
};
export type ResetPasswordRequest = {
  token: string;
  password: string;
};

const authValidation = {
  register,
  login,
  changePassword,
};

export default authValidation;
