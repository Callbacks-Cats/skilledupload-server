import { ObjectCannedACL, S3 } from '@aws-sdk/client-s3';

const spaces = new S3({
  forcePathStyle: true,
  endpoint: 'https://skilledupload-bucket.nyc3.digitaloceanspaces.com',
  region: 'us-east-1',
  credentials: {
    accessKeyId: '',
    secretAccessKey: ''
  }
});

export const addFileToSpace = async (
  type: 'image' | 'file' | 'video',
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
    // https://skilledupload-bucket.nyc3.cdn.digitaloceanspaces.com/images/profile-pictures/65ca7e2ffb47905dafc9cc2a.jpg
    const url = `https://skilledupload-bucket.nyc3.cdn.digitaloceanspaces.com/${bucket}/${folder}/${filename}`;
    return {
      url,
      success: true
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error; // Re-throw for error handling
  }
};

export default spaces;
