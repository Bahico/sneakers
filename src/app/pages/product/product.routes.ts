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
    pathMatch: 'full',
    loadComponent: () => import('./filter/product-filter'),
    children: [
      {
        path: '**',
        pathMatch: 'full',
        loadComponent: () => import('./filter/product-filter')
      }
    ]
  }
] satisfies import('@angular/router').Routes;
