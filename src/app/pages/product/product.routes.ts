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
    path: 'search',
    loadComponent: () => import('./search/product-search')
  },
  {
    path: 'search-page',
    loadComponent: () => import('./filter/product-filter'),
    data: {
      mode: 'search'
    }
  },
  {
    path: ':gender',
    loadComponent: () => import('./filter/product-filter'),
    data: {
      mode: 'category'
    },
    children: [
      {
        path: '**',
        pathMatch: 'full',
        loadComponent: () => import('./filter/product-filter')
      }
    ]
  }
] satisfies import('@angular/router').Routes;
