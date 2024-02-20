import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils';
import { SendResponse } from '../../utils/SendRespnse';
import { IUserDoc } from '../user/user.interface';
import * as applicantService from './applicant.service';

export const createApplicant = catchAsync(async (req: Request, res: Response) => {
  const applicant = await applicantService.createApplicant(req.body);
  return SendResponse(res, true, applicant, httpStatus.CREATED, 'Applicant created successfully');
});

export const updateApplicant = catchAsync(async (req: Request, res: Response) => {
  const applicant = await applicantService.udpateApplicantByUserId(req.params.userId, req.body);
  return SendResponse(res, true, applicant, httpStatus.OK, 'Applicant updated successfully');
});

export const getApplicant = catchAsync(async (req: Request, res: Response) => {
  const applicant = await applicantService.getApplicantByUserId(req.params.userId);
  return SendResponse(res, true, applicant, httpStatus.OK, 'Applicant fetched successfully');
});

export const uploadResume = catchAsync(async (req: Request, res: Response) => {
  const applicant = await applicantService.uploadResume(
    (req.user as IUserDoc)?.id,
    req?.file?.buffer as Buffer
  );
  return SendResponse(res, true, applicant, httpStatus.OK, 'Resume uploaded successfully');
});

export const getPendingResumes = catchAsync(async (req: Request, res: Response) => {
  const applicants = await applicantService.getPendingResumes();
  return SendResponse(res, true, applicants, httpStatus.OK, 'Pending resumes fetched successfully');
});
