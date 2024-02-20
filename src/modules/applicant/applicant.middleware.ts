import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { USER_ROLES } from '../../constants';
import { ApiError } from '../../utils';
import { User } from '../user';

export const isUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.body.user || req.params.userId;

    if (!userId) {
      next(new ApiError(httpStatus.UNAUTHORIZED, 'User not found'));
    }
    const user = await User.findOne({ _id: userId });
    if (!user || user.role !== USER_ROLES.USER) {
      next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
    } else if (user.role === USER_ROLES.USER) {
      next();
    }
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Internal Server Error');
  }
};
