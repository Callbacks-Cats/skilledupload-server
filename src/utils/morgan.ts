import { Request, Response } from 'express';
import morgan from 'morgan';
import config from '../config';
import { logger } from './logger';

morgan.token('message', (_req: Request, res: Response) => res.locals['errorMessage'] || '');

const getIpFormat = () => (config.env === 'production' ? ':remote-addr - ' : '');
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errroResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

/**
Custom success handler for Morgan middleware
@param {morgan.FormatFn} successResponseFormat - The log format for successful responses
@param {Request} _req - The incoming request object (not used in this function)
@param {Response} res - The outgoing response object
@returns {void}
*/
export const successHandler = morgan(successResponseFormat, {
  skip: (_req: Request, res: Response) => res.statusCode >= 400,
  stream: { write: (message: string) => logger.info(message.trim()) }
});

/**
Custom error handler for Morgan middleware
@param {morgan.FormatFn} errorResponseFormat - The log format for error responses
@param {Request} _req - The incoming request object (not used in this function)
@param {Response} res - The outgoing response object
@returns {void}
*/
export const errorHandler = morgan(errroResponseFormat, {
  skip: (_req: Request, res: Response) => res.statusCode < 400,
  stream: { write: (message: string) => logger.error(message.trim()) }
});
