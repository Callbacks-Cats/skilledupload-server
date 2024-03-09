import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils';
import { SendResponse } from '../../utils/SendRespnse';
import { IUserDoc } from '../user/user.interface';
import * as jobPostService from './jobPost.service';

export const createJobPost = catchAsync(async (req: Request, res: Response) => {
  let paylod = req.body;
  paylod.createdBy = (req.user as IUserDoc).id;
  const post = await jobPostService.createJobPost(paylod);
  return SendResponse(res, true, post, httpStatus.CREATED, 'Job Post Created Successfully');
});

export const getJobPostBySlug = catchAsync(async (req: Request, res: Response) => {
  const post = await jobPostService.getPostBySlug(req.params.slug);
  return SendResponse(res, true, post, httpStatus.OK, 'Job Post Fetched Successfully');
});

export const getAllJobPosts = catchAsync(async (req: Request, res: Response) => {
  const posts = await jobPostService.getAllJobPosts(req.query);
  return SendResponse(res, true, posts, httpStatus.OK, 'Job Posts Fetched Successfully');
});

export const updateJobPost = catchAsync(async (req: Request, res: Response) => {
  const post = await jobPostService.updateJobPost(req.params.slug, req.body);
  return SendResponse(res, true, post, httpStatus.OK, 'Job Post Updated Successfully');
});

export const deleteJobPost = catchAsync(async (req: Request, res: Response) => {
  const post = await jobPostService.deletePostBySlug(req.params.slug);
  return SendResponse(res, true, post, httpStatus.OK, 'Job Post Deleted Successfully');
});
