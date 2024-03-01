import httpStatus from 'http-status';
import { IOptions } from '../../plugin/paginate';
import { ApiError } from '../../utils';
import {
  IBannerConfigBody,
  IBannerConfigDoc,
  UpdateBannerConfigBody
} from './bannerConfig.interface';
import BannerConfig from './bannerConfig.model';

/**
 * Add a new banner
 * @param {IBannerConfigBody} body
 * @returns {Promise<IBannerConfigDoc>}
 */
export const addBanner = async (body: IBannerConfigBody): Promise<IBannerConfigDoc> => {
  return await BannerConfig.create(body);
};

/**
 * Get all banners
 * @param {IOptions} options - The query options
 * @param {Record<string, any>} filters - The query filtersq
 * @returns {Promise<IBannerConfigDoc[]>}
 */
export const getAllBanners = async (
  options: IOptions,
  filters: { isActive: boolean }
): Promise<any> => {
  const banners = await BannerConfig.paginate(filters, options);
  return banners;
};

/**
 * Get banner by id
 * @param {string} id - The banner id
 * @returns {Promise<IBannerConfigDoc>}
 */
export const getBannerById = async (id: string): Promise<IBannerConfigDoc | null> => {
  const banner = await BannerConfig.findById(id);
  return banner;
};

/**
 * Update a banner by id
 * @param {string} id - The banner id
 * @param {UpdateBannerConfigBody} body - The banner body
 * @returns {Promise<IBannerConfigDoc>}
 */
export const updateBanner = async (
  id: string,
  body: UpdateBannerConfigBody
): Promise<IBannerConfigDoc> => {
  const banner = await getBannerById(id);
  if (!banner) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Banner not found');
  }
  Object.assign(banner, body);
  await banner.save();
  return banner;
};

/**
 * Delete banner by id
 * @param {string} id - The banner id
 * @returns {Promise<IBannerConfigDoc>}
 */
export const deleteBannerById = async (id: string): Promise<IBannerConfigDoc> => {
  const banner = await getBannerById(id);
  if (!banner) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Banner not found');
  }
  await BannerConfig.findOneAndDelete({ _id: id });
  return banner;
};

/**
 * Toggole banner status by id
 * @param {string} id - The banner id
 * @returns {Promise<IBannerConfigDoc>}
 */
export const toggleBannerStatus = async (id: string): Promise<IBannerConfigDoc> => {
  const banner = await getBannerById(id);
  if (!banner) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Banner not found');
  }
  banner.isActive = !banner.isActive;
  await banner.save();
  return banner;
};
