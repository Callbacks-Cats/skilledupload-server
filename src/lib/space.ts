import { ObjectCannedACL, S3 } from '@aws-sdk/client-s3';
import config from '../config';

const spaces = new S3({
  forcePathStyle: true,
  endpoint: config.digitalOcean.endpoint,
  region: 'us-east-1',
  credentials: {
    accessKeyId: config.digitalOcean.accessKey,
    secretAccessKey: config.digitalOcean.secretKey
  }
});

/**
 * Uploads a file to DigitalOcean Spaces.
 * @param type The type of file ('image', 'file', or 'video').
 * @param file The file content as a Buffer.
 * @param filename The name of the file.
 * @param folder The folder within the DigitalOcean Space to upload the file to.
 * @param contentType The MIME type of the file.
 * @returns An object containing the URL of the uploaded file and a success flag.
 */
export const addFileToSpace = async (
  type: string,
  file: Buffer,
  filename: string,
  folder: string,
  contentType: any
) => {
  const bucket = type === 'image' ? 'images' : type === 'file' ? 'files' : 'videos';

  const params = {
    Bucket: bucket,
    Key: `${folder}/${filename}`,
    Body: file,
    ContentType: contentType,
    ACL: ObjectCannedACL.public_read
  };

  try {
    const updatedFile = await spaces.putObject(params);
    const url = `${config.digitalOcean.endpoint}/${bucket}/${folder}/${filename}`;
    return {
      url,
      success: true
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Updates a file in DigitalOcean Spaces.
 * @param type The type of file ('image', 'file', or 'video').
 * @param file The file content as a Buffer.
 * @param filename The name of the file.
 * @param folder The folder within the DigitalOcean Space to upload the file to.
 * @param contentType The MIME type of the file.
 * @returns An object containing the URL of the updated file and a success flag.
 */
export const updateFileInSpace = async (
  type: string,
  file: Buffer,
  filename: string,
  folder: string,
  contentType: any
) => {
  const bucket = type === 'image' ? 'images' : type === 'file' ? 'files' : 'videos';

  const params = {
    Bucket: bucket,
    Key: `${folder}/${filename}`,
    Body: file,
    ContentType: contentType,
    ACL: ObjectCannedACL.public_read
  };

  try {
    const updatedFile = await spaces.putObject(params);
    const url = `${config.digitalOcean.endpoint}/${bucket}/${folder}/${filename}`;
    return {
      url,
      success: true
    };
  } catch (error) {
    throw error;
  }
};

export default spaces;
