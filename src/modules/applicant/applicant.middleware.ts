import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { USER_ROLES } from '../../constants';
import { ApiError } from '../../utils';
import { User } from '../user';
import { IUserDoc } from '../user/user.interface';
import { getApplicantByUserId } from './applicant.service';

export const isUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as IUserDoc)?.id;

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

export const isVideoResumeLimitExceeded = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as IUserDoc)?.id;
    const applicant = await getApplicantByUserId(userId);
    if (!applicant) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Applicant not found');
    }

    if (!applicant.videoResume) {
      return next();
    }

    if (applicant.videoResume.length >= 3) {
      next(new ApiError(httpStatus.BAD_REQUEST, 'Video resume limit exceeded'));
    }
    next();
  } catch (error) {
    console.error('Error checking video resume limit:', error);
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
  }
};
