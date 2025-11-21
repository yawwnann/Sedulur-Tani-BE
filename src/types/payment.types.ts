export interface CreatePaymentDTO {
  checkout_id: string;
}

export interface CreatePaymentResponse {
  snap_token?: string;
  redirect_url?: string;
  transaction_id: string;
}

export interface PaymentStatusResponse {
  checkout_id: string;
  transaction_id: string;
  transaction_status: string;
  payment_type?: string;
  gross_amount: number;
  transaction_time?: Date;
}

export interface MidtransNotification {
  transaction_time?: string;
  transaction_status: string;
  transaction_id: string;
  status_message?: string;
  status_code: string;
  signature_key: string;
  settlement_time?: string;
  payment_type: string;
  order_id: string;
  merchant_id?: string;
  gross_amount: string;
  fraud_status?: string;
  currency?: string;
}
