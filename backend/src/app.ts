import express from 'express';
import cors from 'cors';
import routes from './routes/v1/index';
import { config } from './config/config';
import { authLimiter } from './middlewares/rateLimiter';
import { errorConverter, errorHandler } from './middlewares/error';

const app = express();

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
// v1 api routes
// enable cors
app.use(cors()); // This handles CORS for all methods and paths

if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

app.use('/v1', routes);
// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);
export default app;
