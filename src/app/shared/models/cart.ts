import {ProductListDetailModel, Variant} from '@/models/product.model';

export interface CartListDetail {
  id: number;
  created_at: Date | string;
  product: ProductListDetailModel;
  quantity: number;
  size: string;
  sku: Variant;
}

export interface CartList {
  items: CartListDetail[];
  total_items: number;
  total_price: number;
}

export interface CartAdd {
  sku_id: number;
  quantity: number;
}

export interface Summary {
  total: number;
  items_count: number;
  currency: number;
}
