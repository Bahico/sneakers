export interface OrderItem {
  id: string;
  product_name: string;
  product_article: string;
  brand_name: string;
  size: Record<string, unknown>;
  price_per_item: number;
  quantity: number;
  total_price: number;
  product_image_url: string;
}

export interface OrderListDetail {
  id: string;
  order_number: string;
  status: OrderType;
  total_amount: number;
  is_split_payment: boolean;
  first_payment_completed: boolean;
  second_payment_completed: boolean;
  created_at: string;
  items_count: number;
  items: OrderItem[];
}

export type OrderType = 'pending_payment' | 'partially_paid' | 'paid' | 'customs' | 'photo_report_ready' | 'in_transit' | 'ready_for_pickup' | 'delivering' | 'delivered' | 'cancelled';

export type DeliveryType = 'cdek_pickup' | 'cdek_courier' | 'russian_post';

export type PaymentType = 'full' | 'split_first' | 'split_second';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';

export interface Payment {
  id: string;
  amount: number;
  payment_type: PaymentType;
  status: PaymentStatus;
  transaction_id: string;
  created_at: string;
  completed_at: string | null;
}

export interface OrderDetail {
  id: string;
  order_number: string;
  status: OrderType;
  subtotal: number;
  total_amount: number;
  is_split_payment: boolean;
  first_payment_amount: number;
  second_payment_amount: number;
  first_payment_completed: boolean;
  second_payment_completed: boolean;
  delivery_type: DeliveryType;
  delivery_data: Record<string, unknown>;
  customer_first_name: string;
  customer_last_name: string;
  customer_middle_name: string;
  customer_phone: string;
  customer_comment: string;
  photo_report_urls: string[];
  photo_report_uploaded_at: string | null;
  cashback_amount: number;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  items: OrderItem[];
  payments: Payment[];
}
