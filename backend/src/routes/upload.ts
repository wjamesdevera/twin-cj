import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ status: "error", message: "No file uploaded" });
    return;
  }

  const imageUrl = `http://localhost:8080/uploads/${req.file.filename}`;
  res.status(200).json({ status: "success", message: "File uploaded", imageUrl });
});

export default router;
