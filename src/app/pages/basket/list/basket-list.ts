import { Component, computed, inject } from '@angular/core';
import { TuiBreadcrumbs } from '@taiga-ui/kit';
import { TuiFormatNumberPipe, TuiLink } from '@taiga-ui/core';
import { RouterLink } from '@angular/router';
import { TuiItem } from '@taiga-ui/cdk';
import { CartStore } from '@/cart';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { CartService } from '@/services/cart.service';
import { IconComponent } from '@/components/icon/icon';
import { CartListDetail } from '@/models/cart';

@Component({
  templateUrl: 'basket-list.html',
  selector: 'basket-list',
  host: { class: 'flex w-full justify-center' },
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

  protected readonly itemsPrice = computed(() => this.carts().items.reduce((a, b) => a + b.total_price, 0));
  protected readonly itemsCountText = computed(() => {
    const n = this.carts().total_items;
    if (n % 100 >= 11 && n % 100 <= 14) {
      return "товаров"
    } else if (n % 10 == 1) {
      return "товар"
    } else if (n % 10 >= 2 && n % 10 <= 4) {
      return "товара"
    } else {
      return "товаров"
    }
  })

  protected readonly carts = this.cartStore.carts;
  protected readonly items = [
    {
      caption: 'Главная',
      routerLink: '/',
    },
    {
      caption: 'Корзина'
    },
  ];

  removeCart(cartId: string) {
    this.cartService.deleteCart(cartId).subscribe()
  }

  decrease(cart: CartListDetail) {
    this.cartService.changeQuantity(cart.id, cart.quantity - 1).subscribe();
  }

  increase(cart: CartListDetail) {
    this.cartService.changeQuantity(cart.id, cart.quantity + 1).subscribe();
  }
}
