import {Component, inject, model, OnInit} from '@angular/core';
import {TuiTabs} from '@taiga-ui/kit';
import {NgClass} from '@angular/common';
import {ProductDetailStore} from '@/product/detail/services/product-detail-store';

@Component({
  templateUrl: 'product-detail-size.component.html',
  imports: [
    TuiTabs,
    NgClass
  ],
  selector: 'product-detail-size'
})
export class ProductDetailSizeComponent {
  private readonly productDetailStore = inject(ProductDetailStore);

  protected readonly detail = this.productDetailStore.detail;
  protected readonly active = this.productDetailStore.sizeValue;
  protected readonly activeItemIndex = model<number>(0);

  onChangeIndex() {
    const size = this.detail().sizeTable[this.activeItemIndex()];
    this.productDetailStore.sizeType.set(size.primary ? 'primary' : size.type);
  }
}
