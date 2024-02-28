import httpStatus from 'http-status';
import { FILE_TYPES } from '../../constants';
import { addFileToSpace, deleteFileFromSpace } from '../../lib';
import { ApiError } from '../../utils';

/**
 * Upload a file to the DigitalOcean Spaces
 * @param file The file to upload
 */
export const uploadFile = async (file: any): Promise<any> => {
  const fileType = file.mimetype.split('/')[1];
  const fileName = `${Date.now()}.${fileType}`;

  const folderName =
    fileType === FILE_TYPES.VIDEO ? 'videos' : fileType === FILE_TYPES.IMAGE ? 'images' : 'files';

  // upload the file to the DigitalOcean Spaces
  const uploadedFile = await addFileToSpace(
    fileType === FILE_TYPES.IMAGE ? 'image' : fileType === FILE_TYPES.VIDEO ? 'video' : 'file',
    file.buffer,
    fileName,
    folderName,
    file.mimetype
  );
  if (!uploadedFile.success) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to upload file! Please try again.'
    );
  }

  return uploadedFile.url;
};

/**
 * Delete a file from the DigitalOcean Spaces
 * @param url The URL of the file to delete
 * @returns An object containing the URL of the updated file and a success flag.
 */
export const deleteFile = async (url: string): Promise<any> => {
  // get the file name from the URL
  const fileName = url.split('/').pop();
  const folderName = url.split('/')[url.split('/').length - 2];

  console.log('folderName', folderName);
  console.log('fileName', fileName);

  // // delete the file from the DigitalOcean Spaces
  const deletedFile = await deleteFileFromSpace(
    folderName === 'images'
      ? FILE_TYPES.IMAGE
      : folderName === 'videos'
        ? FILE_TYPES.VIDEO
        : FILE_TYPES.FILE,
    fileName as string,
    folderName
  );
  if (!deletedFile) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to delete file! Please try again.'
    );
  }
  return deletedFile;
};
