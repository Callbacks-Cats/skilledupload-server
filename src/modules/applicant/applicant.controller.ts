import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils';
import { SendResponse } from '../../utils/SendRespnse';
import * as applicantService from './applicant.service';

export const createApplicant = catchAsync(async (req: Request, res: Response) => {
  const applicant = await applicantService.createApplicant(req.body);
  return SendResponse(res, true, applicant, httpStatus.CREATED, 'Applicant created successfully');
});

export const updateApplicant = catchAsync(async (req: Request, res: Response) => {
  return SendResponse(res, true, {}, httpStatus.OK, 'Applicant updated successfully');
});
