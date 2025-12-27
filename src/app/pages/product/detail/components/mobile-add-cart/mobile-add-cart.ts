import {Component, inject} from '@angular/core';
import {ProductDetailStore} from '@/product/detail/services/product-detail-store';
import {IconComponent} from '@/components/icon/icon';
import {CartService} from '@/services/cart.service';
import {RouterLink} from '@angular/router';
import {injectContext} from '@taiga-ui/polymorpheus';
import {TuiDialogContext} from '@taiga-ui/core';

@Component({
  templateUrl: 'mobile-add-cart.html',
  selector: 'mobile-add-cart',
  imports: [
    IconComponent,
    RouterLink
  ]
})
export class MobileAddCart {
  private readonly productDetailStore = inject(ProductDetailStore);
  protected readonly cartService = inject(CartService);
  protected readonly context = injectContext<TuiDialogContext<string, string>>();

  protected readonly cart = this.productDetailStore.cart;
  detail = this.productDetailStore.detail;
  selectedSku = this.productDetailStore.selectedSkus;

  decrease() {
    this.cartService.changeQuantity(this.cart().id, this.cart().quantity-1).subscribe();
  }

  increase() {
    this.cartService.changeQuantity(this.cart().id, this.cart().quantity+1).subscribe();
  }

  removeFromCart() {
    this.cartService.deleteCart(this.cart().id).subscribe(() => this.close());
  }

  close() {
    this.context.$implicit.complete();
  }
}
