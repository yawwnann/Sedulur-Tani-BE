import { Request, Response } from "express";
import PaymentService from "../services/payment.service";
import { CreatePaymentDTO, MidtransNotification } from "../types/payment.types";
import { successResponse } from "../utils/responseFormatter";
import { handleError } from "../utils/errorHandler";

class PaymentController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const { checkout_id }: CreatePaymentDTO = req.body;

      if (!checkout_id) {
        return res.status(400).json({
          success: false,
          message: "checkout_id is required"
        });
      }

      const payment = await PaymentService.createPayment(checkout_id, userId);

      return res.status(201).json(
        successResponse("Payment created successfully", payment)
      );
    } catch (error) {
      return handleError(res, error);
    }
  }

  async webhook(req: Request, res: Response): Promise<Response> {
    try {
      const notification: MidtransNotification = req.body;

      await PaymentService.handleWebhook(notification);

      return res.status(200).json({
        success: true,
        message: "Notification processed"
      });
    } catch (error) {
      console.error("Webhook error:", error);
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Webhook processing failed"
      });
    }
  }

  async getStatus(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const { checkoutId } = req.params;

      if (!checkoutId) {
        return res.status(400).json({
          success: false,
          message: "checkoutId is required"
        });
      }

      const status = await PaymentService.getPaymentStatus(checkoutId, userId);

      return res.status(200).json(
        successResponse("Payment status retrieved successfully", status)
      );
    } catch (error) {
      return handleError(res, error);
    }
  }
}

export default new PaymentController();
