import {Component, inject} from '@angular/core';
import {ProductDetailStore} from '@/product/detail/services/product-detail-store';
import {AsyncPipe} from '@angular/common';
import {TuiFormatNumberPipe} from '@taiga-ui/core';

@Component({
  templateUrl: 'product-detail-name.html',
  imports: [
    AsyncPipe,
    TuiFormatNumberPipe
  ],
  selector: 'product-detail-name'
})
export class ProductDetailName {
  private readonly productDetailStore = inject(ProductDetailStore);

  protected readonly detail = this.productDetailStore.detail;
}
