import prisma from "../database/prisma";
import { CreatePaymentResponse, MidtransNotification } from "../types/payment.types";
import * as crypto from "crypto";

const midtransClient = require('midtrans-client');

class PaymentService {
  private snap: any;

  constructor() {
    this.snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });
  }

  async getCheckout(checkoutId: string, userId: string) {
    const checkout = await prisma.checkout.findUnique({
      where: { id: checkoutId },
      include: {
        user: true,
        orders: {
          include: {
            product: true
          }
        }
      }
    });

    if (!checkout) {
      throw new Error("Checkout not found");
    }

    if (checkout.user_id !== userId) {
      throw new Error("Forbidden: You can only access your own checkout");
    }

    return checkout;
  }

  async createPayment(checkoutId: string, userId: string): Promise<CreatePaymentResponse> {
    const checkout = await this.getCheckout(checkoutId, userId);

    if (checkout.status === 'paid') {
      throw new Error("Checkout has already been paid");
    }

    if (checkout.status === 'expired') {
      throw new Error("Checkout has expired");
    }

    const orderId = `ORDER-${checkoutId}-${Date.now()}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: checkout.grand_total
      },
      customer_details: {
        first_name: checkout.user.name,
        email: checkout.user.email,
        phone: checkout.user.phone || ''
      },
      item_details: checkout.orders.map(order => ({
        id: order.product_id,
        price: order.price_each,
        quantity: order.quantity,
        name: order.product.name
      }))
    };

    try {
      const transaction = await this.snap.createTransaction(parameter);

      const payment = await prisma.payment.create({
        data: {
          checkout_id: checkoutId,
          midtrans_order_id: orderId,
          transaction_id: transaction.token,
          gross_amount: checkout.grand_total,
          transaction_status: 'pending'
        }
      });

      return {
        snap_token: transaction.token,
        redirect_url: transaction.redirect_url,
        transaction_id: payment.id
      };
    } catch (error: any) {
      throw new Error(`Failed to create payment: ${error.message}`);
    }
  }

  verifySignature(notification: MidtransNotification): boolean {
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const orderId = notification.order_id;
    const statusCode = notification.status_code;
    const grossAmount = notification.gross_amount;
    const signatureKey = notification.signature_key;

    const hash = crypto
      .createHash('sha512')
      .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
      .digest('hex');

    return hash === signatureKey;
  }

  async handleWebhook(notification: MidtransNotification): Promise<void> {
    if (!this.verifySignature(notification)) {
      throw new Error("Invalid signature");
    }

    const payment = await prisma.payment.findUnique({
      where: { midtrans_order_id: notification.order_id },
      include: {
        checkout: {
          include: {
            orders: true
          }
        }
      }
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    await prisma.paymentNotification.create({
      data: {
        payment_id: payment.id,
        raw_body: JSON.stringify(notification)
      }
    });

    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    let checkoutStatus: 'pending' | 'paid' | 'expired' = 'pending';
    let orderStatus: 'pending' | 'processed' | 'shipped' | 'completed' | 'cancelled' = 'pending';

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        checkoutStatus = 'paid';
        orderStatus = 'processed';
      }
    } else if (transactionStatus === 'settlement') {
      checkoutStatus = 'paid';
      orderStatus = 'processed';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      checkoutStatus = 'expired';
      orderStatus = 'cancelled';
    } else if (transactionStatus === 'pending') {
      checkoutStatus = 'pending';
      orderStatus = 'pending';
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        transaction_status: transactionStatus,
        payment_type: notification.payment_type,
        transaction_time: notification.transaction_time ? new Date(notification.transaction_time) : null
      }
    });

    await prisma.checkout.update({
      where: { id: payment.checkout_id },
      data: {
        status: checkoutStatus
      }
    });

    await prisma.order.updateMany({
      where: { checkout_id: payment.checkout_id },
      data: {
        status: orderStatus
      }
    });

    if (checkoutStatus === 'paid') {
      for (const order of payment.checkout.orders) {
        const product = await prisma.product.findUnique({
          where: { id: order.product_id }
        });

        if (product) {
          await prisma.product.update({
            where: { id: order.product_id },
            data: {
              stock: product.stock - order.quantity
            }
          });
        }
      }
    }
  }

  async getPaymentStatus(checkoutId: string, userId: string) {
    const checkout = await this.getCheckout(checkoutId, userId);

    const payment = await prisma.payment.findFirst({
      where: { checkout_id: checkoutId },
      orderBy: { created_at: 'desc' }
    });

    if (!payment) {
      throw new Error("Payment not found for this checkout");
    }

    return {
      checkout_id: checkoutId,
      transaction_id: payment.id,
      transaction_status: payment.transaction_status,
      payment_type: payment.payment_type || undefined,
      gross_amount: payment.gross_amount,
      transaction_time: payment.transaction_time || undefined
    };
  }
}

export default new PaymentService();
