import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
const fileFilter = (
  request: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const filetypes = /\.(jpg|jpeg|png|webp)$/i;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Invalid file type"));
  }
};

export const upload = multer({
  dest: path.join(__dirname, "../uploads"),
  limits: { fileSize: 100000000 },
  fileFilter,
});
