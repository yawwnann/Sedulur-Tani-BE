import express, { Router } from "express";
import PaymentController from "../controllers/PaymentController";
import authMiddleware from "../middleware/auth";

const router: Router = express.Router();

router.post("/create", authMiddleware, PaymentController.create);
router.post("/webhook", PaymentController.webhook);
router.get("/:checkoutId", authMiddleware, PaymentController.getStatus);

export default router;
