import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import crypto from "crypto";

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

const UPLOAD_DIR = path.join(__dirname, "../../uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${crypto.randomUUID()}.${ext}`);
  },
});

export const upload = multer({
  dest: path.join(__dirname, "../uploads"),
  limits: { fileSize: 100000000 },
  storage: storage,
  fileFilter,
});
