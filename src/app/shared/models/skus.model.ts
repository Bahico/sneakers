import {PriceV2Model} from './price-v2.model';

export interface Skus {
  images: string[];
  skuId: number;
  cnyPrice: number;
  price: number;
  size: {
    primary: string;
    [key: string]: string;
  };
  fromAvailability: [];
  maxPrice: number;
  deliveryTime: {
    min: number;
    max: number;
    express_max: number;
    express_min: number;
  };
  priceV2: PriceV2Model;
  properties: []
}
