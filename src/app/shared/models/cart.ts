import {ProductListDetailModel, Variant} from '@/models/product.model';

export interface CartListDetail {
  id: string;
  product: Omit<ProductListDetailModel, 'main_variant'>;
  variant: Variant
  quantity: number;
  total_price: number;
  price_snapshot: number;
}

export interface CartList {
  items: CartListDetail[];
  total_items: number;
  total_price: number;
}

export interface CartAdd {
  product_id: string;
  variant_id: string;
  quantity: number;
}
