import { Router } from "express";
import {
  getAllUsersHandler,
  getUserHandler,
} from "../controllers/user.controller";

const router = Router();

router.get("/", getUserHandler);
router.get("/all", getAllUsersHandler);

export default router;
