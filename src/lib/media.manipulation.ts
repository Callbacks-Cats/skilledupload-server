import sharp from 'sharp';

interface ResizeOptions {
  width?: number;
  height?: number;
  fit?: any;
  withoutEnlargement?: boolean;
  format?: string; // e.g., 'jpeg', 'png'
  quality?: number; // 0-100 for lossy formats
}

/**
 * Resize an image buffer using the Sharp library.
 * @param {Buffer} buffer - The image buffer to resize.
 * @param {ResizeOptions} options - Options for resizing the image.
 * @returns {Promise<Buffer>} - A Promise that resolves to the resized image buffer.
 * @throws {Error} - Throws an error if there is an issue resizing the image.
 *
 * Example usage:
 * const resizedBuffer = await resizeImage(imageBuffer, {
 *   width: 300, // Desired width of the resized image
 *   height: 200, // Desired height of the resized image
 *   fit: 'cover', // Resize strategy ('cover', 'contain', 'fill', 'inside', 'outside')
 *   withoutEnlargement: true, // Prevent enlarging images beyond their original dimensions
 *   format: 'jpeg', // Output format of the resized image ('jpeg', 'png', etc.)
 *   quality: 80 // Image quality for lossy formats (0-100)
 * });
 */
export async function resizeImage(buffer: Buffer, options: ResizeOptions = {}): Promise<Buffer> {
  try {
    const resizedImage = await sharp(buffer).resize(options);

    return await resizedImage.toBuffer();
  } catch (error: any) {
    throw new Error('Error resizing image: ' + error?.message);
  }
}
