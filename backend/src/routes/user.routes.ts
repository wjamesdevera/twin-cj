import { Router } from "express";
import {
  deleteUserHandler,
  editUserHandler,
  getAllUsersHandler,
  getUserByIdHandler,
  getUserHandler,
} from "../controllers/user.controller";

const router = Router();

router.get("/", getUserHandler);
router.get("/all", getAllUsersHandler);
router.get("/:id", getUserByIdHandler);
router.put("/:id", editUserHandler);
router.delete("/:id", deleteUserHandler);

export default router;
