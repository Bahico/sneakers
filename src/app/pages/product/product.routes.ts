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
    children: [
      {
        path: '**',
        loadComponent: () => import('./filter/components/category-slug/category-slug')
      }
    ]
  }
] satisfies import('@angular/router').Routes;
