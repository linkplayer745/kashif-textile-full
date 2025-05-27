import express from 'express';
import authValidation from '../../validations/auth.validation';
import { validate } from '../../middlewares/validate';
import adminController from '../../controllers/admin.controller';

const router = express.Router();

router.post('/login', validate(authValidation.login), adminController.login);

router.route('/products').get();

export default router;
