import {ProductListDetailModel} from '@/models/product.model';

export interface Favorite {
  id: string;
  created_at: Date;
  product: ProductListDetailModel
}
