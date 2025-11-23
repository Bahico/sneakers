import {Routes} from '@angular/router';

export default [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    loadComponent: () => import('./list/basket-list')
  },
  {
    path: 'create',
    loadComponent: () => import('./create/basket-create')
  },
] satisfies Routes;
