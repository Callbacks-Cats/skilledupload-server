import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import httpStatus from 'http-status';
import passport from 'passport';
import swagger from 'swagger-ui-express';
import config from './config';
import { middleware as xss } from './middlewares';
import { jwtStrategy } from './modules/auth';
import routes from './routes';
import { specs } from './routes/docs.routes';
import { ApiError, error, morgan } from './utils';

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ limit: '50mb' }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(
  cors({
    origin: 'http://localhost:3000', // Specify the allowed origin
    credentials: true // Allow sending cookies and credentials
  })
);

// api docs
app.use('/docs', swagger.serve, swagger.setup(specs));

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// serve static files
app.use('/uploads', express.static('uploads'));

// v1 api routes
app.use('/api/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// // convert error to ApiError, if needed
app.use(error.errorConverter);

// handle error
app.use(error.errorHandler);

export default app;
