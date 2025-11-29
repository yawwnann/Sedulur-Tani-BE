import express, { Router } from "express";
import PaymentController from "../controllers/payment.controller";
import authMiddleware from "../middleware/auth";

const router: Router = express.Router();

// Test routes for Midtrans
router.get("/test-config", PaymentController.testMidtransConfig);
router.post("/test-transaction", PaymentController.testCreateTransaction);

// Production routes
router.post("/create", authMiddleware, PaymentController.create);
router.post("/webhook", PaymentController.webhook);
router.get("/:checkoutId", authMiddleware, PaymentController.getStatus);

export default router;
