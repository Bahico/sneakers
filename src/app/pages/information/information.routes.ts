import {Routes} from '@angular/router';

export default [
  {
    path: 'payment',
    loadComponent: () => import('./payment/payment-information')
  },
  {
    path: 'reviews',
    loadComponent: () => import('./reviews/reviews-information')
  },
  {
    path: 'question-and-answers',
    loadComponent: () => import('./question-and-answers/question-and-answers')
  },
  {
    path: 'choose-size',
    loadComponent: () => import('./choose-size/choose-size-information')
  }
] satisfies Routes;
