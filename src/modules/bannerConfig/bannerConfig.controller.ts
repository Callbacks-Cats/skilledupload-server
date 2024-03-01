import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync, logger, pick } from '../../utils';
import { SendResponse } from '../../utils/SendRespnse';
import * as bannerConfigService from './bannerConfig.service';

export const addbanner = catchAsync(async (req: Request, res: Response) => {
  logger.info('Add banner!');
  const banner = await bannerConfigService.addBanner(req.body);
  return SendResponse(res, true, banner, httpStatus.CREATED, 'Banner added successfully');
});

export const getAllBanners = catchAsync(async (req: Request, res: Response) => {
  logger.info('Get all banners!');

  const filters = pick(req.query, ['isActive']);

  const banners = await bannerConfigService.getAllBanners(req.query, filters);
  return SendResponse(res, true, banners, httpStatus.OK, 'Banners retrieved successfully');
});

export const updatebanner = catchAsync(async (req: Request, res: Response) => {
  logger.info('Update banner!');
  const banner = await bannerConfigService.updateBanner(req.params.id, req.body);
  return SendResponse(res, true, banner, httpStatus.OK, 'Banner updated successfully');
});

export const deletebanner = catchAsync(async (req: Request, res: Response) => {
  logger.info('Delete banner!');
  const banner = await bannerConfigService.deleteBannerById(req.params.id);
  return SendResponse(res, true, banner, httpStatus.OK, 'Banner deleted successfully');
});

export const toggoleBannerStatus = catchAsync(async (req: Request, res: Response) => {
  logger.info('Toggole banner status!');
  const banner = await bannerConfigService.toggleBannerStatus(req.params.id);
  return SendResponse(res, true, banner, httpStatus.OK, 'Banner status toggled successfully');
});
