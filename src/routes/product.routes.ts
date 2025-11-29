import express, { Router } from "express";
import ProductController from "../controllers/product.controller";
import authMiddleware from "../middleware/auth";
import { requireSeller } from "../middleware/roleCheck";

const router: Router = express.Router();

router.post("/", authMiddleware, requireSeller, ProductController.create);
router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getById);
router.put("/:id", authMiddleware, requireSeller, ProductController.update);
router.delete("/:id", authMiddleware, requireSeller, ProductController.delete);

export default router;
