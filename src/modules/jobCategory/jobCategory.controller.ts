import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils';
import { SendResponse } from '../../utils/SendRespnse';
import * as jobCategoryService from './jobCategory.service';

export const createJobCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await jobCategoryService.createJobCategory(req.body);
  return SendResponse(res, true, category, httpStatus.CREATED, 'Job category created successfully');
});

export const getAllJobCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await jobCategoryService.getAllJobCategories();
  return SendResponse(res, true, categories, httpStatus.OK, 'All job categories');
});

export const updateJobCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await jobCategoryService.updateJobCategory(req.params.id, req.body);
  return SendResponse(res, true, category, httpStatus.OK, 'Job category updated successfully');
});

export const deleteJobCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await jobCategoryService.deleteJobCategory(req.params.id);
  return SendResponse(res, true, category, httpStatus.OK, 'Job category deleted successfully');
});
