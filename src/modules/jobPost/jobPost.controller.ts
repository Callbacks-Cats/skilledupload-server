import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils';
import { SendResponse } from '../../utils/SendRespnse';
import * as jobPostService from './jobPost.service';

export const createJobPost = catchAsync(async (req: Request, res: Response) => {
  const post = await jobPostService.createJobPost(req.body);
  return SendResponse(res, true, post, httpStatus.CREATED, 'Job Post Created Successfully');
});
