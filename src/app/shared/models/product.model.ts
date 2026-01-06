import {SizeTable} from './size-table.model';
import {Series} from './series.model';
import {Brand} from '@/models/brand';
import {Category} from '@/models/category';

export interface ProductModel {
  id: string;
  fit: string;
  price: number;
  description: string;
  name: string;
  slug: string;
  parsed_spu_id: number;
  article: string;
  availability: boolean;
  from_availability: boolean;
  price_from_availability: null;
  returnable: boolean;
  discount: boolean;
  shoplaza: boolean;
  large_sized: boolean;
  images: string[];
  created_at: Date;
  updated_at: Date;
  brand: Brand;
  category: Category;
  series: Series;
  size_table: SizeTable[];
  variants: Variant[];
  properties: Properties[];
}

interface Properties {
  id: string;
  key: string;
  value: string[];
  definition_id: string;
  is_filterable: boolean;
}

export interface Variant {
  id: string;
  api_id: number;
  price: number;
  price_without_discount: number;
  discount: boolean;
  price_express: number;
  price_express_without_discount: number;
  price_from_availability: number;
  previous_price_from_availability: number;
  discount_from_availability: boolean;
  cny_price: number;
  split_first: number;
  split_second: number;
  size: any;
  delivery_min_days: number;
  delivery_max_days: number;
  express_min_days: number;
  express_max_days: number;
  is_main: boolean;
  from_availability: boolean;
  large_sized: boolean;
  shoplaza: boolean;
  availability: boolean;
  max_price: number;
  variant_images: string[];
}

export interface ProductListDetailModel {
  id: string;
  slug: string;
  name: string;
  brand: Brand;
  availability: boolean;
  category: {
    category1: string;
    category2: string;
    category3: string;
  };
  fit: 'MALE' | 'MAN';
  discount: boolean;
  returnable: boolean;
  large_sized: boolean;
  shoplaza: boolean;
  is_favorite: boolean;
  price: number;
  article: string;
  split: number;
  images: string[];
  main_variant: Variant;
}

export interface ProductListModel {
  products: ProductListDetailModel[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  max_price: number;
  min_price: number;
  category: {
    id: string;
    full_slug: string;
    name: {
      MALE: string;
      FEMALE: string;
      UNISEX: string;
    }
  }
}
