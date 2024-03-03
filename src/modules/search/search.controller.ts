import { Request, Response } from 'express';
import { catchAsync } from '../../utils';
import * as searchService from './search.service';

export const search = catchAsync(async (req: Request, res: Response) => {
  const { userId, jobCategory, name } = req.query;
  const searchResult = await searchService.search({ userId, jobCategory, name });
  res.status(200).json({ message: 'Search', searchResult });
});
