import express from 'express';
import authController from '../../controllers/auth.controller';
import { validate } from '../../middlewares/validate';
import authValidation from '../../validations/auth.validation';
import auth from '../../middlewares/auth';
const router = express.Router();

router.post(
  '/register',
  validate(authValidation.register),
  authController.register,
);
router.post('/login', validate(authValidation.login), authController.login);

router.post(
  '/change-password',
  auth,
  validate(authValidation.changePassword),
  authController.changePassword,
);
export default router;
