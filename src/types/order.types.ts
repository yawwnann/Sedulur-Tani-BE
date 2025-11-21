import { OrderStatus } from "@prisma/client";

export interface OrderResponse {
  id: string;
  checkout_id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  price_each: number;
  total_price: number;
  status: OrderStatus;
  created_at: Date;
  updated_at: Date;
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string | null;
  };
  checkout?: {
    id: string;
    status: string;
  };
}

export interface UpdateOrderStatusDTO {
  status: OrderStatus;
}

export interface OrderListResponse {
  orders: OrderResponse[];
  total: number;
}
