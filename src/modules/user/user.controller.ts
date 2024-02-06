import { Request, Response } from 'express';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { ApiError, catchAsync, logger } from '../../utils';
import { SendResponse } from '../../utils/SendRespnse';
import * as userService from './user.service';

export const createUser = catchAsync(async (req: Request, res: Response) => {
  logger.info('Creating user', req.body);
  const user = await userService.createUser(req.body);
  return SendResponse(res, true, user, httpStatus.CREATED, 'User created successfully');
});

export const getUser = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    const user = await userService.getUserById(new mongoose.Types.ObjectId(req.params['userId']));
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send(user);
  }
});
