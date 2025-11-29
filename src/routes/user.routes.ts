import express, { Router } from "express";
import UserController from "../controllers/user.controller";
import authMiddleware from "../middleware/auth";

const router: Router = express.Router();

router.get("/:id", authMiddleware, UserController.getById);
router.put("/:id", authMiddleware, UserController.updateProfile);

export default router;
