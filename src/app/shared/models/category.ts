export interface Category {
  id: string;
  full_slug: string;
  name: {
    MALE: string;
    CHILD: string;
    FEMALE: string;
    UNISEX: string;
  }
}

export interface CategoryListDetailModel {
  id: string;
  image_url: string;
  slug_part: string;
  full_slug: string;
  level: number;
  name: string;
  products_count: number;
  is_active: boolean;
  sort_order: number;
  children: CategoryListDetailModel[];
}