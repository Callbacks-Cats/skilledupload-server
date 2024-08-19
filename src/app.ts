import compression from 'compression';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import helmet from 'helmet';
import httpStatus from 'http-status';
import passport from 'passport';
import path from 'path';
import swagger from 'swagger-ui-express';
import config from './config';
import { middleware as xss } from './middlewares';
import { jwtStrategy } from './modules/auth';
import routes from './routes';
import { specs } from './routes/docs.routes';
import { ApiError, error, morgan } from './utils';
import { authLimiter } from './utils/rateLimiter';

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// create /public folder if it doesn't exist
const dir = './public';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json({ limit: '3000mb' }));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ limit: '300mb' }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());

// serve the static files
app.use('/public', express.static('public'));
app.use(
  '/public/videos',
  express.static('public/videos', {
    setHeaders: (res, path) => {
      if (path.endsWith('.mp4')) {
        res.setHeader('Content-Type', 'video/mp4');
      }
    }
  })
);

app.get('/public/videos/:filename', (req, res) => {
  const videoPath = path.join(__dirname, 'public/videos', req.params.filename);
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4'
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4'
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

// app.use(
//   express.static('public', {
//     setHeaders: (res, path) => {
//       if (path.endsWith('.mp4')) {
//         res.setHeader('Content-Type', 'video/mp4');
//       } else if (path.endsWith('.webm')) {
//         res.setHeader('Content-Type', 'video/webm');
//       } // Add more MIME types for other video formats if needed
//     }
//   })
// );

// api docs
app.use('/api/docs', swagger.serve, swagger.setup(specs, {}));

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/api/v1/auth', authLimiter);
}

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
