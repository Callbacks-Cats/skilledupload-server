import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import config from '../config';
import { ApiError } from './ApiError';
import { logger } from './logger';

/**
Error converter middleware
@param {any} err - The error object to be converted
@param {Request} _req - The incoming request object (not used in this function)
@param {Response} res - The outgoing response object
@param {NextFunction} next - The next middleware function
@returns {void}
*/
export const errorConverter = (err: any, _req: Request, res: Response, next: NextFunction) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message: string = error.message || `${httpStatus[statusCode]}`;
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

/**
Error handler middlewaret.
@param {ApiError} err - The error object to be handled and formatted
@param {Request} _req - The incoming request object (not used in this function)
@param {Response} res - The outgoing response object
@param {NextFunction} _next - The next middleware function (not used in this function)
@returns {Response} - The response object with formatted error details
*/
export const errorHandler = (err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = 'Internal Server Error';
  }

  res.locals['errorMessage'] = err.message;

  const response = {
    success: false,
    error: message,
    code: statusCode,
    stack: err.isOperational ? err.stack : '',
    data: null
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  return res.status(statusCode).json(response);
};
