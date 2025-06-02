import express from 'express';
import authRoute from './auth.route';
import categoryRoute from './category.route';
import cartRoute from './cart.route';
import orderRoute from './order.route';
import adminRoute from './admin.route';
import productsRoute from './products.route';
import userRoute from './user.route';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/category',
    route: categoryRoute,
  },
  {
    path: '/cart',
    route: cartRoute,
  },
  {
    path: '/order',
    route: orderRoute,
  },
  {
    path: '/admin',
    route: adminRoute,
  },
  {
    path: '/products',
    route: productsRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
