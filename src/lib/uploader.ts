import multer from 'multer';
import path from 'path';
const storage = multer.diskStorage({});

let validateImage = function (file: any, cb: any) {
  let allowedFileTypes = /jpeg|jpg|png/;
  const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedFileTypes.test(file.mimetype);
  if (extension && mimeType) {
    return cb(null, true);
  } else {
    cb('Invalid file type. Only JPEG, PNG file are allowed.');
  }
};
export const imageUploader = multer({
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, callback) {
    validateImage(file, callback);
  }
});

let validateFile = function (file: any, cb: any) {
  let allowedFileTypes = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv/;
  const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedFileTypes.test(file.mimetype);
  if (extension && mimeType) {
    return cb(null, true);
  } else {
    cb(
      'Invalid file type. Only JPEG, PNG, PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV file are allowed.'
    );
  }
};

let validateVideoFile = function (file: any, cb: any) {
  let allowedFileTypes = /mp4|avi|flv|wmv|mov/;
  const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedFileTypes.test(file.mimetype);
  if (extension && mimeType) {
    return cb(null, true);
  } else {
    cb('Invalid file type. Only MP4, AVI, FLV, WMV, MOV file are allowed.');
  }
};

export const fileUploader = multer({
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, callback) {
    // if file is video
    if (file.fieldname === 'video') {
      validateVideoFile(file, callback);
    } else {
      validateFile(file, callback);
    }
  }
});
