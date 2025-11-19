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
  }
] satisfies Routes;
