import express, { Router } from "express";
import HomeController from "../controllers/HomeController";
import AuthController from "../controllers/AuthController";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import addressRoutes from "./address.routes";
import productRoutes from "./product.routes";
import cartRoutes from "./cart.routes";
import checkoutRoutes from "./checkout.routes";
import paymentRoutes from "./payment.routes";
import orderRoutes from "./order.routes";
import authMiddleware from "../middleware/auth";

const router: Router = express.Router();

router.get("/", HomeController.index);
router.get("/me", authMiddleware, AuthController.getProfile);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/addresses", addressRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/payments", paymentRoutes);
router.use("/orders", orderRoutes);

export default router;
