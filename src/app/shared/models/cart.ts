import {ProductListDetailModel} from '@/models/product.model';
import {Skus} from '@/models/skus.model';

export interface CartList {
  id: number;
  created_at: Date | string;
  product: ProductListDetailModel;
  quantity: number;
  size: string;
  sku: Skus;
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
