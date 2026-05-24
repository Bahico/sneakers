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

export interface OrderListDetailModel {
  id: string;
  delivery_track_number: string;
  order_number: string;
  delivery_data: any;
  delivery_type: DeliveryType;
  status: OrderType;
  total_amount: number;
  is_split_payment: boolean;
  first_payment_completed: boolean;
  second_payment_completed: boolean;
  created_at: Date;
  items_count: number;
  payment_url: string
  items: OrderItem[];
}

export interface OrderPayment {
  id: string;
  amount: number;
  payment_type: 'full' | 'split_first' | 'split_second';
  status: PaymentStatus,
  transaction_id: string;
  created_at: Date;
  completed_at: Date;
}

export type PaymentStatus = 'pending' | 'completed' | 'processing' | 'cancelled' | 'refunded' | 'failed';
export type OrderType =
  'pending_payment' |
  'partially_paid' |
  'paid' |
  'customs' |
  'photo_report_ready' |
  'purchasing' |
  'china_warehouse' |
  'sent_to_russia' |
  'arrived_in_country' |
  'returned' |
  'in_transit' |
  'ready_for_pickup' |
  'delivering' |
  'delivering_by_courier' |
  'delivered' |
  'cancelled';

export type DeliveryType = 'cdek_pickup' | 'cdek_courier' | 'russian_post';

export enum DeliveryTypeKeys {
  cdek_pickup,
  cdek_courier,
  russian_post,
}
export const deliveryTypeValues = {
  0: 'cdek_pickup',
  1: 'cdek_courier',
  2: 'russian_post',
}

export interface OrderDetailModel {
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
  delivery_data: any;
  delivery_track_number: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_middle_name: string;
  customer_phone: string;
  customer_comment: string;
  photo_report_urls: string[];
  cashback_amount: number;
  created_at: Date;
  updated_at: Date;
  completed_at: Date;
  items: OrderItem[];
  payments: OrderPayment[];
  waiting_day: Date;
  delivery_date: Date | null;
  days_path: number;
  pending_payment_at: Date | null;
  partially_paid_at: Date | null;
  photo_report_ready_at: Date | null;
  purchasing_at: Date | null;
  paid_at: Date | null;
  china_warehouse_at: Date | null;
  sent_to_russia_at: Date | null;
  arrived_in_country_at: Date | null;
  in_transit_at: Date | null;
  ready_for_pickup_at: Date | null;
  delivered_at: Date | null;
  delivering_by_courier_at: Date | null;
  cancelled_at: Date | null;
  returned_at: Date | null;
}
