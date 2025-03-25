import { Router } from "express";
import {
  deleteSessionHandler,
  getSessionHandler,
} from "../controllers/session.controller";

const router = Router();

router.get("/", getSessionHandler);
router.delete("/:id", deleteSessionHandler);
export default router;
