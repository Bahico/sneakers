import {Routes} from '@angular/router';

export default [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'main',
    loadComponent: () => import('./main/main-profile')
  }
] satisfies Routes;
