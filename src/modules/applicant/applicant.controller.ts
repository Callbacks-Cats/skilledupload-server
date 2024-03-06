import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ApiError, catchAsync, pick } from '../../utils';
import { SendResponse } from '../../utils/SendRespnse';
import { IUserDoc } from '../user/user.interface';
import * as applicantService from './applicant.service';

export const createApplicant = catchAsync(async (req: Request, res: Response) => {
  const applicant = await applicantService.createApplicant(req.body);
  return SendResponse(res, true, applicant, httpStatus.CREATED, 'Applicant created successfully');
});

export const updateApplicant = catchAsync(async (req: Request, res: Response) => {
  const applicant = await applicantService.udpateApplicantByUserId(
    (req.user as IUserDoc).id,
    req.body
  );
  return SendResponse(res, true, applicant, httpStatus.OK, 'Applicant updated successfully');
});

export const getApplicant = catchAsync(async (req: Request, res: Response) => {
  const applicant = await applicantService.getApplicantByUserId(req.params.userId);
  return SendResponse(res, true, applicant, httpStatus.OK, 'Applicant fetched successfully');
});

export const getApplicantBySlug = catchAsync(async (req: Request, res: Response) => {
  const applicant = await applicantService.getApplicantBySlug(req.params.slug);
  return SendResponse(res, true, applicant, httpStatus.OK, 'Applicant fetched successfully');
});

export const getAllApplicants = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await applicantService.queryApplicants(filters, options);
  return SendResponse(res, true, result, httpStatus.OK, 'Applicants fetched successfully');
});

export const uploadResume = catchAsync(async (req: Request, res: Response) => {
  if (!req?.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please upload a resume');
  }

  const applicant = await applicantService.uploadResume(
    (req.user as IUserDoc)?.id,
    req?.file?.buffer as Buffer
  );
  return SendResponse(res, true, applicant, httpStatus.OK, 'Resume uploaded successfully');
});

export const uploadVideoResume = catchAsync(async (req: Request, res: Response) => {
  const applicant = await applicantService.uploadVideoResume(
    (req.user as IUserDoc)?.id,
    req?.file?.buffer as Buffer
  );
  return SendResponse(res, true, applicant, httpStatus.OK, 'Video resume uploaded successfully');
});

export const deleteVideoResumeByUser = catchAsync(async (req: Request, res: Response) => {
  const applicant = await applicantService.deleteVideoResumeByUser(
    (req.user as IUserDoc)?.id,
    req.params?.resumeId
  );
  return SendResponse(res, true, applicant, httpStatus.OK, 'Video resume deleted successfully');
});

export const approveApplicantProfile = catchAsync(async (req: Request, res: Response) => {
  const applicant = await applicantService.approveApplicantProfile(req.params.applicantId);
  return SendResponse(res, true, applicant, httpStatus.OK, 'Applicant approved successfully');
});

export const createUserApplicantByAdmin = catchAsync(async (req: Request, res: Response) => {
  const applicant = await applicantService.createApplicantByAdmin(req.body);
  return SendResponse(res, true, applicant, httpStatus.CREATED, 'Applicant created successfully');
});
