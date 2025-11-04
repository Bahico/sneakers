import {Routes} from '@angular/router';

export default [
  {
    path: 'payment',
    loadComponent: () => import('./payment/payment-information')
  }
] satisfies Routes;
