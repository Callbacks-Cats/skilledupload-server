import { Request, Response } from 'express';
import fs from 'fs';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import path from 'path';
import { resizeImage } from '../../lib/media.manipulation';
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

export const updateUpdateProfilePicture = catchAsync(async (req: Request, res: Response) => {
  const resizedImage = await resizeImage(req.file?.buffer as Buffer, { width: 500, height: 500 });
  console.log(resizedImage);

  const filename = 'resized_image.jpg'; // Adjust filename and extension as needed
  const filePath = path.join(__dirname, 'uploads', filename); // Specify save location
  await fs.promises.writeFile(filePath, resizedImage);

  return SendResponse(res, true, req.file, httpStatus.OK, 'Profile picture updated successfully');
});
