import multer from "multer";
import { BadRequestError } from "../errors";
import { NextFunction } from "express";

const MIMETYPE = [
  "image/jpg",
  "image/png",
  "image/jpeg",
  "video/x-msvideo",
  "video/quicktime",
  "video/mp4",
  "video/ogg",
  "video/x-ms-wmv",
  "video/webm",
];
const fileFilter = (req: any, file: any, cb: any) => {
  if (MIMETYPE.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new BadRequestError(
      "Image uploaded is not of type jpg/jpeg or png",
    );
    cb(error, false);
  }
};

export const upload = multer({
  // limits: {
  //   fileSize: 1024 * 1024 * 10, // Max file size : 10 MB
  // },
  fileFilter: fileFilter,
});

export default upload;
