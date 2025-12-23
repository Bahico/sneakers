export const SIZES = ['36', '37', '38', '39', '40', '41', '42', '43'];
export const SIZE_TABLE = ['EU', 'RU', 'US'];
export const BRANDS = ['Adidas', 'Aime Leon Dore', 'Air Kicks', 'Andrey Kim'];
export const SORT = [
  {
    name: 'По умолчанию',
  },
  {
    name: 'Сначала новые',
    key: 'created_at'
  },
  {
    key: 'price',
    name: 'По возрастанию цены',
  },
  {
    key: '-price',
    name: 'По убыванию цены',
  },
];
export const PRODUCT_FILTER_BREAD_CRUMBS = [
  {
    caption: 'Главная',
    routerLink: '/',
  },
  {
    caption: 'Мужское'
  },
  {
    caption: 'Обувь'
  },
]
