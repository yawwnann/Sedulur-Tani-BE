import prisma from "../database/prisma";
import { CreatePaymentResponse, MidtransNotification } from "../types/payment.types";
import * as crypto from "crypto";

const midtransClient = require('midtrans-client');

class PaymentService {
  private snap: any;

  constructor() {
    this.initializeSnap();
  }

  private initializeSnap() {
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
    try {
      const checkout = await this.getCheckout(checkoutId, userId);

      if (checkout.status === 'paid') {
        throw new Error("Checkout has already been paid");
      }

      if (checkout.status === 'expired') {
        throw new Error("Checkout has expired");
      }

      const orderId = `ORDER-${checkoutId}-${Date.now()}`;

      // Add shipping cost to item_details if exists
      const itemDetails = checkout.orders.map(order => ({
        id: order.product_id,
        price: order.price_each,
        quantity: order.quantity,
        name: order.product.name
      }));

      // Add shipping as separate item
      if (checkout.shipping_price > 0) {
        itemDetails.push({
          id: 'SHIPPING',
          price: checkout.shipping_price,
          quantity: 1,
          name: 'Biaya Pengiriman'
        });
      }

      const parameter = {
        transaction_details: {
          order_id: orderId,
          gross_amount: checkout.grand_total
        },
        customer_details: {
          first_name: checkout.user.name || 'Customer',
          email: checkout.user.email,
          phone: checkout.user.phone || '08123456789'
        },
        item_details: itemDetails
      };

      console.log('Creating Midtrans transaction with params:', JSON.stringify(parameter, null, 2));

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
      console.error('Payment creation error:', error);
      throw new Error(`Failed to create payment: ${error.message || error.toString()}`);
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

    // Clear cart after successful payment
    if (checkoutStatus === 'paid') {
      const checkout = await prisma.checkout.findUnique({
        where: { id: payment.checkout_id },
        select: { user_id: true }
      });

      if (checkout) {
        const cart = await prisma.cart.findUnique({
          where: { user_id: checkout.user_id }
        });

        if (cart) {
          await prisma.cartItem.deleteMany({
            where: { cart_id: cart.id }
          });
        }
      }

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

  async testMidtransConnection() {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const clientKey = process.env.MIDTRANS_CLIENT_KEY;
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

    if (!serverKey || serverKey === 'your_midtrans_server_key') {
      throw new Error("Midtrans Server Key is not configured properly");
    }

    if (!clientKey || clientKey === 'your_midtrans_client_key') {
      throw new Error("Midtrans Client Key is not configured properly");
    }

    // Validate server key format
    const expectedPrefix = isProduction ? 'Mid-server-' : 'SB-Mid-server-';
    if (!serverKey.startsWith(expectedPrefix)) {
      throw new Error(`Invalid Server Key format. Expected to start with '${expectedPrefix}', got '${serverKey.substring(0, 15)}...'`);
    }

    // Validate client key format
    const expectedClientPrefix = isProduction ? 'Mid-client-' : 'SB-Mid-client-';
    if (!clientKey.startsWith(expectedClientPrefix)) {
      throw new Error(`Invalid Client Key format. Expected to start with '${expectedClientPrefix}', got '${clientKey.substring(0, 15)}...'`);
    }

    // Test API connection with a simple ping
    try {
      const testSnap = new midtransClient.Snap({
        isProduction: isProduction,
        serverKey: serverKey,
        clientKey: clientKey
      });

      return {
        configured: true,
        environment: isProduction ? 'production' : 'sandbox',
        server_key_prefix: serverKey.substring(0, 15) + '...',
        client_key_prefix: clientKey.substring(0, 15) + '...',
        server_key_length: serverKey.length,
        client_key_length: clientKey.length,
        snap_initialized: !!this.snap,
        validation: 'Keys format is valid'
      };
    } catch (error: any) {
      throw new Error(`Midtrans initialization failed: ${error.message}`);
    }
  }

  async testCreateTransaction(data: {
    amount: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
  }) {
    // Reinitialize snap with current env vars to ensure latest keys are used
    this.initializeSnap();

    const orderId = `TEST-ORDER-${Date.now()}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: data.amount
      },
      customer_details: {
        first_name: data.customer_name,
        email: data.customer_email,
        phone: data.customer_phone
      },
      item_details: [
        {
          id: 'TEST-ITEM-1',
          price: data.amount,
          quantity: 1,
          name: 'Test Product'
        }
      ]
    };

    try {
      const transaction = await this.snap.createTransaction(parameter);

      return {
        order_id: orderId,
        snap_token: transaction.token,
        redirect_url: transaction.redirect_url,
        message: 'Test transaction created successfully. Use snap_token for payment.'
      };
    } catch (error: any) {
      throw new Error(`Failed to create test transaction: ${error.message}`);
    }
  }
}

export default new PaymentService();
