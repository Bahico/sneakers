import {Component, computed, inject} from '@angular/core';
import {ProductDetailStore} from '@/product/detail/services/product-detail-store';
import {AsyncPipe} from '@angular/common';
import {CartService} from '@/services/cart.service';
import {CartStore} from '@/cart';
import {IconComponent} from '@/components/icon/icon';
import {TuiFormatNumberPipe} from '@taiga-ui/core';
import {AccountStore} from '@/account';
import {AuthenticationOpen} from '@/components/authentication/authentication-open';

@Component({
  templateUrl: 'product-detail-order.html',
  imports: [
    IconComponent,
    AsyncPipe,
    TuiFormatNumberPipe
  ],
  selector: 'product-detail-order'
})
export class ProductDetailOrder {
  private readonly accountStore = inject(AccountStore);
  private readonly authenticationService = inject(AuthenticationOpen);
  private readonly productDetailStore = inject(ProductDetailStore);
  protected readonly cartService = inject(CartService);
  protected readonly cartStore = inject(CartStore);

  protected readonly isAuthed = computed(() => !!this.accountStore.account());
  protected readonly selectedSkus = this.productDetailStore.selectedSkus;
  protected readonly data$ = computed(() => this.selectedSkus() || this.productDetailStore.detail()?.skus?.[0]);

  protected readonly cart = computed(() => this.cartStore.carts()?.results?.find(item => item.sku.skuId === this.selectedSkus()?.skuId))

  addToCart() {
    if (!this.isAuthed()) {
      return this.authenticationService.openModal();
    }
    this.cartService.addCart({
      sku_id: this.selectedSkus().skuId,
      quantity: 1
    })
  }

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
