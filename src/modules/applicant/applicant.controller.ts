import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils';

export const createApplicant = catchAsync(async (req: Request, res: Response) => {
  return res.status(httpStatus.OK).json({ message: 'createApplicant' });
});
