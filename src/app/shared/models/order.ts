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
  created_at: Date;
  items_count: number;
  payment_url: string
  items: OrderItem[];
}

export type OrderType = 'pending_payment' | 'partially_paid' | 'paid' | 'customs' | 'photo_report_ready' | 'in_transit' | 'ready_for_pickup' | 'delivering' | 'delivered' | 'cancelled';

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
