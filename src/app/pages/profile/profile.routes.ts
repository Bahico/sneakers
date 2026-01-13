import {Routes} from '@angular/router';

export default [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'main',
    loadComponent: () => import('@/profile/pages/main/main-profile')
  },
  {
    path: 'edit',
    loadComponent: () => import('./pages/edit/profile-edit')
  },
  {
    path: 'loyalty-program',
    loadComponent: () => import('./pages/loyalty-program/loyalty-program')
  },
  {
    path: 'referrals',
    loadComponent: () => import('./pages/referrals/referrals')
  },
] satisfies Routes;
