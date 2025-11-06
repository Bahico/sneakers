import {Component, computed, inject} from '@angular/core';
import {ProductDetailStore} from '@/product/detail/services/product-detail-store';
import {DecimalPipe} from '@angular/common';
import {CartService} from '@/services/cart.service';

@Component({
  templateUrl: 'product-detail-order.html',
  imports: [
    DecimalPipe
  ],
  selector: 'product-detail-order'
})
export class ProductDetailOrder {
  private readonly productDetailStore = inject(ProductDetailStore);
  protected readonly cartService = inject(CartService);

  protected readonly selectedSkus = this.productDetailStore.selectedSkus;
  protected readonly data$ = computed(() => this.selectedSkus() || this.productDetailStore.detail()?.skus?.[0]);

  addToCart() {
    this.cartService.addCart({
      sku_id: this.selectedSkus().skuId,
      quantity: 1
    }).subscribe(data => {
      console.log(data);
    })
  }
}
