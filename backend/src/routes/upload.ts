import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure the "uploads" directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store in "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});

const upload = multer({ storage });

// Upload route with explicit type annotations
router.post("/", upload.single("image"), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ status: "error", message: "No file uploaded" });
    return;
  }

  const imageUrl = `http://localhost:8080/uploads/${req.file.filename}`;
  res.status(200).json({ status: "success", message: "File uploaded", imageUrl });
});

export default router;
