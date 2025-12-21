export default [
  {
    path: '',
    redirectTo: 'filter',
    pathMatch: 'full',
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./detail/product-detail'),
  },
  {
    path: ':gender',
    loadComponent: () => import('./filter/product-filter'),
    children: [
      {
        path: '**',
        loadComponent: () => import('./filter/components/category-slug/category-slug')
      }
    ]
  }
] satisfies import('@angular/router').Routes;
