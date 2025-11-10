import {Skus} from './skus.model';
import {SizeTable} from './size-table.model';
import {Series} from './series.model';
import {ProductProperty} from './product-property.model';

export interface ProductModel {
  fit: string;
  spuId: number;
  price: number;
  description: string;
  name: string;
  article: string;
  brand: string;
  brandId: number;
  availability: string;
  category1: string;
  category2: string;
  category3: string;
  category: {
    category1: string;
    category2: string;
    category3: string;
  };
  primarySizeType: string;
  fromAvailability: boolean;
  colorTheme: string;
  returnable: boolean;
  images: string[];
  series: Series;
  skus: Skus[];
  sizeTable: SizeTable[];
  metaData: {
    shoplaza: boolean;
  };
  productProperties: ProductProperty[];
  properties: Properties;
}

interface Properties {
  skus: {
    skuId: number;
    properties: [];
  }[];
  propertyValues: [];
  propertyTypes: [];
}

export interface ProductListDetailModel {
  slug: string;
  name: string;
  spuId: number;
  brand: string;
  availability: string;
  category: {
    category1: string;
    category2: string;
    category3: string;
  };
  fit: 'MALE' | 'MAN';
  price: number;
  article: string;
  split: number;
  first_image: string;
  skus: Skus[];
}
