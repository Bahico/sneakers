import {Component, inject} from '@angular/core';
import {ProductDetailStore} from '@/product/detail/services/product-detail-store';
import {DecimalPipe} from '@angular/common';

@Component({
  templateUrl: 'product-detail-name.component.html',
  imports: [
    DecimalPipe
  ],
  selector: 'product-detail-name'
})
export class ProductDetailNameComponent {
  private readonly productDetailStore = inject(ProductDetailStore);

  protected readonly detail = this.productDetailStore.detail;
}
