import {Routes} from '@angular/router';

export default [
  {
    path: 'payment',
    loadComponent: () => import('./payment/payment-information')
  },
  {
    path: 'reviews',
    loadComponent: () => import('./reviews/reviews-information')
  }
] satisfies Routes;
