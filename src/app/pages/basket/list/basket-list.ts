import {afterNextRender, Component, computed, inject, signal} from '@angular/core';
import {TuiBreadcrumbs} from '@taiga-ui/kit';
import {TuiFormatNumberPipe, TuiLink} from '@taiga-ui/core';
import {RouterLink} from '@angular/router';
import {TuiItem} from '@taiga-ui/cdk';
import {CartStore} from '@/cart';
import {AsyncPipe, NgOptimizedImage} from '@angular/common';
import {CartService} from '@/services/cart.service';
import {IconComponent} from '@/components/icon/icon';
import {Summary} from '@/models/cart';

@Component({
  templateUrl: 'basket-list.html',
  selector: 'basket-list',
  host: {class: 'flex w-full justify-center'},
  imports: [
    TuiBreadcrumbs,
    TuiLink,
    RouterLink,
    TuiItem,
    NgOptimizedImage,
    IconComponent,
    TuiFormatNumberPipe,
    AsyncPipe
  ]
})
export default class BasketList {
  private readonly cartStore = inject(CartStore);
  protected readonly cartService = inject(CartService);

  summary = signal<Partial<Summary>>({});

  protected readonly carts = computed(() => this.cartStore.carts());
  protected readonly items = [
    {
      caption: 'Главная',
      routerLink: '/',
    },
    {
      caption: 'Корзина'
    },
  ];

  constructor() {
    afterNextRender(() => {
      this.loadSummary();
    })
  }

  loadSummary() {
    this.cartService
      .summary()
      .subscribe(data => this.summary.set(data))
  }

  removeCart(cartId: number) {
    this.cartService.deleteCart(cartId).subscribe(() => this.loadSummary())
  }

  checkout() {

  }

  decrease(id: number) {
    this.cartService.decrease(id).subscribe(() => this.loadSummary());
  }

  increase(id: number) {
    this.cartService.increase(id).subscribe(() => this.loadSummary());
  }
}
