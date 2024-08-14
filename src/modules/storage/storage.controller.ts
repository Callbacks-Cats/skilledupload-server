import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ApiError, catchAsync } from '../../utils';
import { SendResponse } from '../../utils/SendRespnse';
import * as storageService from './storage.service';

export const uploadFile = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please upload a file');
  }
  const result = await storageService.uploadFile(req, file as any);
  return SendResponse(res, true, result, httpStatus.OK, 'File uploaded successfully');
});

export const deleteFile = catchAsync(async (req: Request, res: Response) => {
  // get the url from the query
  const url = req.query.url as string;

  if (!url) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please provide a file URL');
  }
  const result = await storageService.deleteFile(url);
  return SendResponse(res, true, result, httpStatus.OK, 'File deleted successfully');
});
