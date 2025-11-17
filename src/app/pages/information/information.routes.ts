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
  },
  {
    path: 'original-certificate',
    loadComponent: () => import('./original-certificate/original-certificate')
  },
  {
    path: 'gift-certificate',
    loadComponent: () => import('./gift-certificate/gift-certificate')
  },
  {
    path: 'application',
    loadComponent: () => import('./application/application-information')
  },
  {
    path: 'user-agreement',
    loadComponent: () => import('./user-agreement/user-agreement')
  }
] satisfies Routes;
