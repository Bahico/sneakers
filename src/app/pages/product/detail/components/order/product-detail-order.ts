import {Component, computed, inject} from '@angular/core';
import {ProductDetailStore} from '@/product/detail/services/product-detail-store';
import {AsyncPipe} from '@angular/common';
import {CartService} from '@/services/cart.service';
import {IconComponent} from '@/components/icon/icon';
import {TuiFormatNumberPipe} from '@taiga-ui/core';
import {RouterLink} from '@angular/router';

@Component({
  templateUrl: 'product-detail-order.html',
  imports: [
    IconComponent,
    AsyncPipe,
    TuiFormatNumberPipe,
    RouterLink
  ],
  selector: 'product-detail-order'
})
export class ProductDetailOrder {
  protected readonly productDetailStore = inject(ProductDetailStore);
  protected readonly cartService = inject(CartService);

  protected readonly selectedSkus = this.productDetailStore.selectedSkus;
  protected readonly cart = this.productDetailStore.cart;
  protected readonly data$ = computed(() => this.selectedSkus() || this.productDetailStore.detail()?.variants?.[0]);

  decrease() {
    this.cartService.decrease(this.cart().id).subscribe();
  }

  increase() {
    this.cartService.increase(this.cart().id).subscribe();
  }

  removeFromCart() {
    this.cartService.deleteCart(this.cart().id).subscribe();
  }
}
