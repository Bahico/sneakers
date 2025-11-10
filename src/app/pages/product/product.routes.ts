export default [
  {
    path: '',
    redirectTo: 'filter',
    pathMatch: 'full',
  },
  {
    path: 'detail/:spuId',
    loadComponent: () => import('./detail/product-detail'),
  },
  {
    path: 'filter',
    loadComponent: () => import('./filter/product-filter'),
  },
] satisfies import('@angular/router').Routes;
