export function getFolderName(file: any) {
  const mimeType = file.mimetype;

  if (mimeType.startsWith('image/')) {
    return 'skilled-upload/images';
  } else if (mimeType.startsWith('video/')) {
    return 'skilled-upload/videos';
  } else if (
    mimeType === 'application/pdf' ||
    mimeType === 'application/msword' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || // DOCX
    mimeType === 'application/vnd.ms-excel' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || // XLSX
    mimeType === 'text/plain'
  ) {
    return 'skilled-upload/documents';
  } else {
    return 'skilled-upload/others';
  }
}

/**
 * @name extractPublicId
 * @description Extracts the public ID from a Cloudinary URL and prepends it with a folder path.
 * @param {string} cloudinaryUrl - The Cloudinary URL from which to extract the public ID.
 * @returns {string} The public ID prepended with the folder path `fashion-store/`.
 * @example
 * // Example usage:
 * const url = 'https://res.cloudinary.com/demo/image/upload/v1630000000/sample.jpg';
 * const publicId = extractPublicId(url);
 * console.log(publicId); // Output: 'fashion-store/sample'
 */
export function extractPublicId(cloudinaryUrl: string): any {
  const regex = /\/v\d+\/([^\/]+)\./;
  const match = cloudinaryUrl.match(regex);
  return match ? match[1] : null;
}
