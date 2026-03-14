import {Routes} from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./blogs')
  },
  {
    path: ':slug',
    loadComponent: () => import('./detail/blog-detail')
  }
] satisfies Routes;
