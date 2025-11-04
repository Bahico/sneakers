import {Component} from '@angular/core';
import {TuiBreadcrumbs} from '@taiga-ui/kit';
import {TuiLink} from '@taiga-ui/core';
import {TuiItem} from '@taiga-ui/cdk';
import {RouterLink} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';

@Component({
  templateUrl: 'payment-information.html',
  selector: 'payment-information',
  host: {class: 'flex w-full justify-center'},
  imports: [
    TuiBreadcrumbs,
    TuiLink,
    TuiItem,
    RouterLink,
    NgOptimizedImage
  ]
})
export default class PaymentInformation {
  readonly items = [
    {
      caption: 'Главная',
      routerLink: '/',
    },
    {
      caption: 'Оплата и доставка'
    },
  ]
}
