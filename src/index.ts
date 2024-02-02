import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config';
import { logger } from './utils';

let server: Server;
mongoose.connect(config.mongoose.url as string).then(() => {
  logger.info(`😊 Databased is connected!`);
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

const existHandler = () => {
  if (server) {
    server.close(() => {
      // logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error) => {
  logger.error(error);
  console.log(error);
  existHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
