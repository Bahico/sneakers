import {DeliveryType} from '@/models/order';

export interface PaymentModel {
  delivery_type: DeliveryType;
  delivery_data: unknown;
  customer_phone: string;
  customer_email: string;
  customer_comment: string;
  customer_last_name: string;
  customer_first_name: string;
  customer_middle_name: string;
  customer_no_middle_name: boolean;
  customer_passport_series: string;
  customer_passport_number: string;
  customer_passport_issue_date: string;
  use_split_payment: boolean;
  referral_code: string;
  promocode: string;
  use_sneaker_coins: boolean;
}
