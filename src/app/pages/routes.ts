import {Routes} from '@angular/router';

export default [
  {
    path: '',
    redirectTo: 'home/male',
    pathMatch: 'full',
  },
  {
    path: 'home',
    redirectTo: 'home/male',
    pathMatch: 'full',
  },
  {
    path: 'home/:gender',
    loadComponent: () => import('./home/home'),
  },
  {
    path: 'product',
    loadChildren: () => import('./product/product.routes'),
  },
  {
    path: 'information',
    loadChildren: () => import('./information/information.routes'),
  },
  {
    path: 'basket',
    loadChildren: () => import('./basket/basket.routes'),
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.routes'),
  }
] satisfies Routes;
