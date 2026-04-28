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
    path: ':gender/:category',
    loadComponent: () => import('./filter/product-filter'),
    data: {
      mode: 'category'
    }
  }
] satisfies import('@angular/router').Routes;
