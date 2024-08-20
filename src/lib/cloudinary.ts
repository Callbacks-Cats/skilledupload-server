import { v2 as cloudinary } from 'cloudinary';
import config from '../config';

interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
}

cloudinary.config({
  cloud_name: config.cloudinary.name,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret
});

/**
 * Uploads a media file to Cloudinary.
 * @param {string} file - The path or URL of the media file to be uploaded.
 * @param {string} path - The folder path in Cloudinary where the file should be stored.
 * @returns {Promise<CloudinaryUploadResult>} A Promise that resolves to the Cloudinary upload result.
 * @throws Will throw an error if the upload process encounters any issues.
 */
export const uploadMedia = async (file: any, path: string): Promise<CloudinaryUploadResult> => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: path,
      resource_type: 'auto'
    });
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Delete a media file from Cloudinary.
 * @param {string} publicId - The public ID of the media file to be deleted.
 * @returns {Promise<CloudinaryUploadResult>} A Promise that resolves to the Cloudinary upload result.
 * @throws Will throw an error if the upload process encounters any issues.
 */
export const deleteMedia = async (
  publicId: string,
  options?: any
): Promise<CloudinaryUploadResult> => {
  try {
    console.log('Public ID: ', publicId);
    const result = await cloudinary.uploader.destroy(publicId, options || {});
    return result as any;
  } catch (error) {
    throw error;
  }
};

/**
 * Update a media file in Cloudinary.
 * @param {string} file - The path or URL of the media file to be updated.
 * @param {string} path - The folder path in Cloudinary where the file should be stored.
 * @returns {Promise<CloudinaryUploadResult>} A Promise that resolves to the Cloudinary upload result.
 * @throws Will throw an error if the upload process encounters any issues.
 */
export const updateMedia = async (
  file: string,
  path: string,
  public_id = ''
): Promise<CloudinaryUploadResult> => {
  try {
    if (public_id) {
      await deleteMedia(public_id);
    }
    const result = await cloudinary.uploader.upload(file, {
      folder: path,
      resource_type: 'auto'
    });
    return result as CloudinaryUploadResult;
  } catch (error) {
    throw error;
  }
};

export default cloudinary;
