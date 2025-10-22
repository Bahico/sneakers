export default [
  {
    path: '',
    redirectTo: 'detail/7536140',
    pathMatch: 'full',
  },
  {
    path: 'detail/:spuId',
    loadComponent: () => import('./detail/product-detail.component'),
  }
] satisfies import('@angular/router').Routes;
