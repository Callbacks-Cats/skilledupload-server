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
  storage: storage,
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

export const fileUploader = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    validateFile(file, callback);
  }
});
