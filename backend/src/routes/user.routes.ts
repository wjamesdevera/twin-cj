import { Router } from "express";
import { getUserHandler } from "../controllers/user.controller";

const router = Router();

router.get("/", getUserHandler);

export default router;
