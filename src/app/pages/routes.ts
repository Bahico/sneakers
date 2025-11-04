import {Routes} from '@angular/router';

export default [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home'),
  },
  {
    path: 'product',
    loadChildren: () => import('./product/product.routes'),
  },
  {
    path: 'information',
    loadChildren: () => import('./information/information.routes'),
  }
] satisfies Routes;
