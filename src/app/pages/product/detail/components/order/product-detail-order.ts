import {Component, computed, inject} from '@angular/core';
import {ProductDetailStore} from '@/product/detail/services/product-detail-store';
import {AsyncPipe, DecimalPipe} from '@angular/common';
import {CartService} from '@/services/cart.service';
import {CartStore} from '@/cart';
import {IconComponent} from '@/components/icon/icon';
import {TuiFormatNumberPipe} from '@taiga-ui/core';

@Component({
  templateUrl: 'product-detail-order.html',
  imports: [
    DecimalPipe,
    IconComponent,
    AsyncPipe,
    TuiFormatNumberPipe
  ],
  selector: 'product-detail-order'
})
export class ProductDetailOrder {
  private readonly productDetailStore = inject(ProductDetailStore);
  protected readonly cartService = inject(CartService);
  protected readonly cartStore = inject(CartStore);

  protected readonly selectedSkus = this.productDetailStore.selectedSkus;
  protected readonly data$ = computed(() => this.selectedSkus() || this.productDetailStore.detail()?.skus?.[0]);

  protected readonly cart = computed(() => this.cartStore.carts()?.results?.find(item => item.sku.skuId === this.selectedSkus()?.skuId))

  addToCart() {
    this.cartService.addCart({
      sku_id: this.selectedSkus().skuId,
      quantity: 1
    })
  }

  decrease() {
    this.cartService.decrease(this.cart().id)
  }

  increase() {
    this.cartService.increase(this.cart().id)
  }

  removeFromCart() {
    this.cartService.deleteCart(this.cart().id)
  }
}
