import { Request } from 'express';
import fs from 'fs';
import path from 'path';

interface FileType {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

export const uploadFileToLocal = async (req: Request, file: FileType): Promise<string | Error> => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    let folderPath = '';
    const fileType = file.mimetype.split('/')[0];

    // Determine the folder based on the file type
    if (fileType === 'image') {
      folderPath = path.join(process.cwd(), 'public', 'images');
    } else if (fileType === 'video') {
      folderPath = path.join(process.cwd(), 'public', 'videos');
    } else if (['application', 'text'].includes(fileType)) {
      folderPath = path.join(process.cwd(), 'public', 'documents');
    } else {
      throw new Error('Unsupported file type');
    }

    // Ensure the folder exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Generate a unique file name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName = `${uniqueSuffix}${path.extname(file.originalname)}`;

    // Define the full file path
    const filePath = path.join(folderPath, fileName);

    // Write the file to disk
    fs.writeFileSync(filePath, file.buffer);

    // Get the server address from the request object
    const serverAddress = `${req.protocol}://${req.get('host')}`;

    // Return the full file URL
    return `${serverAddress}/public/${path.relative(path.join(process.cwd(), 'public'), filePath)}`;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteFileFromLocal = async (fileUrl: string): Promise<Boolean | Error> => {
  try {
    if (!fileUrl) {
      throw new Error('No file URL provided');
    }

    // Extract the relative file path from the URL
    const urlParts = fileUrl.split('/public/');
    if (urlParts.length < 2) {
      throw new Error('Invalid file URL');
    }
    const relativeFilePath = urlParts[1];

    // Convert the relative path to an absolute path
    const filePath = path.join(process.cwd(), 'public', relativeFilePath);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Delete the file
      fs.unlinkSync(filePath);
      return true;
    } else {
      throw new Error('File not found');
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};
