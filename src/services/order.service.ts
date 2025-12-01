import prisma from "../database/prisma";
import { OrderStatus, UserRole } from "@prisma/client";
import { OrderResponse } from "../types/order.types";

class OrderService {
  async getAllOrders(userId: string, role: UserRole): Promise<OrderResponse[]> {
    const whereClause: Record<string, unknown> = {};

    // Buyer hanya bisa lihat pesanan mereka sendiri
    if (role === "buyer") {
      whereClause.user_id = userId;
    }
    // Seller bisa lihat SEMUA pesanan dari semua buyer
    // (tidak ada filter untuk seller)

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            addresses: {
              where: { is_default: true },
              take: 1,
              select: {
                id: true,
                label: true,
                recipient_name: true,
                phone: true,
                address_line: true,
                city: true,
                province: true,
                postal_code: true
              }
            }
          }
        },
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            stock: true,
            image_url: true,
            seller: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        checkout: {
          select: {
            id: true,
            status: true,
            grand_total: true,
            shipping_price: true
          }
        },
        shipments: {
          select: {
            id: true,
            order_id: true,
            courier_name: true,
            tracking_number: true,
            status: true,
            created_at: true,
            updated_at: true
          },
          orderBy: {
            created_at: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return orders as unknown as OrderResponse[];
  }

  async getOrderById(orderId: string, userId: string, role: UserRole): Promise<OrderResponse> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            addresses: {
              select: {
                id: true,
                label: true,
                recipient_name: true,
                phone: true,
                address_line: true,
                city: true,
                province: true,
                postal_code: true,
                is_default: true
              }
            }
          }
        },
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            stock: true,
            image_url: true,
            seller_id: true,
            seller: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        checkout: {
          select: {
            id: true,
            status: true,
            grand_total: true,
            shipping_price: true
          }
        },
        shipments: {
          select: {
            id: true,
            order_id: true,
            courier_name: true,
            tracking_number: true,
            status: true,
            created_at: true,
            updated_at: true
          },
          orderBy: {
            created_at: 'desc'
          }
        }
      }
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Buyer hanya bisa akses pesanan mereka sendiri
    if (role === "buyer" && order.user_id !== userId) {
      throw new Error("Forbidden: You can only access your own orders");
    }

    // Seller bisa akses semua pesanan
    // (tidak ada pembatasan untuk seller)

    return order;
  }

  validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): void {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      pending: ["processed", "cancelled"],
      processed: ["shipped", "cancelled"],
      shipped: ["completed", "cancelled"],
      completed: [],
      cancelled: []
    };

    const allowedStatuses = validTransitions[currentStatus];

    if (!allowedStatuses.includes(newStatus)) {
      throw new Error(
        `Invalid status transition from ${currentStatus} to ${newStatus}. Allowed: ${allowedStatuses.join(", ")}`
      );
    }
  }

  async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    userId: string,
    userRole: UserRole,
    courierName?: string,
    trackingNumber?: string
  ): Promise<OrderResponse> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        product: true,
        checkout: true
      }
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Seller (yang juga admin) bisa update semua order
    // Buyer tidak bisa update order status
    if (userRole !== "seller") {
      throw new Error("Forbidden: Only sellers can update order status");
    }

    this.validateStatusTransition(order.status, newStatus);

    // If changing to shipped status, create shipment record
    if (newStatus === "shipped" && courierName) {
      await prisma.shipment.create({
        data: {
          order_id: orderId,
          courier_name: courierName,
          tracking_number: trackingNumber || null,
          status: "shipping"
        }
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            addresses: {
              where: { is_default: true },
              take: 1,
              select: {
                id: true,
                label: true,
                recipient_name: true,
                phone: true,
                address_line: true,
                city: true,
                province: true,
                postal_code: true
              }
            }
          }
        },
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            stock: true,
            image_url: true
          }
        },
        checkout: {
          select: {
            id: true,
            status: true,
            grand_total: true,
            shipping_price: true
          }
        },
        shipments: {
          select: {
            id: true,
            order_id: true,
            courier_name: true,
            tracking_number: true,
            status: true,
            created_at: true,
            updated_at: true
          },
          orderBy: {
            created_at: 'desc'
          },
          take: 1
        }
      }
    });

    const checkoutOrders = await prisma.order.findMany({
      where: { checkout_id: order.checkout_id }
    });

    const allCompleted = checkoutOrders.every(o => o.status === "completed");
    const anyCancelled = checkoutOrders.some(o => o.status === "cancelled");

    if (allCompleted) {
      await prisma.checkout.update({
        where: { id: order.checkout_id },
        data: { status: "paid" }
      });
    } else if (anyCancelled && checkoutOrders.every(o => o.status === "cancelled")) {
      await prisma.checkout.update({
        where: { id: order.checkout_id },
        data: { status: "expired" }
      });
    }

    return updatedOrder as unknown as OrderResponse;
  }
}

export default new OrderService();
