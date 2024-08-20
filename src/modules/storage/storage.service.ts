import { Request } from 'express';
import { deleteMedia, uploadMedia } from '../../lib/cloudinary';
import { extractPublicId } from '../../utils';

/**
 * Upload a file to the DigitalOcean Spaces
 * @param file The file to upload
 */

export const uploadFile = async (req: Request, file: any): Promise<any> => {
  const uploadedFile = await uploadMedia(file?.path, '');
  return uploadedFile.secure_url;
};

/**
 * Delete a file from the DigitalOcean Spaces
 * @param url The URL of the file to delete
 * @returns An object containing the URL of the updated file and a success flag.
 */
export const deleteFile = async (url: string): Promise<any> => {
  const publicId = extractPublicId(url);
  const deletedFile = await deleteMedia(publicId as string);
  return deletedFile;
};
