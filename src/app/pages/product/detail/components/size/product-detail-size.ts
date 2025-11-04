import {Component, computed, inject, model, OnInit} from '@angular/core';
import {TuiTabs} from '@taiga-ui/kit';
import {NgClass} from '@angular/common';
import {ProductDetailStore} from '@/product/detail/services/product-detail-store';
import {SizeTable} from '@/models/size-table.model';

@Component({
  templateUrl: 'product-detail-size.html',
  imports: [
    TuiTabs,
    NgClass
  ],
  selector: 'product-detail-size'
})
export class ProductDetailSize {
  private readonly productDetailStore = inject(ProductDetailStore);

  protected readonly detail = this.productDetailStore.detail;
  protected readonly active = this.productDetailStore.sizeValue;
  protected readonly activeType = this.productDetailStore.sizeType;
  protected readonly activeItemIndex = model<number>(0);

  protected readonly sizeTable = computed(() =>
    this.detail()?.sizeTable?.filter(size =>
      this.detail().skus.some(sku => sku.size[this.getName(size).toLowerCase()])
    )
  );

  protected readonly sizes = computed(() =>
    this.detail().sizeTable?.[this.activeItemIndex()]?.values?.map(size => ({
      value: size,
      disabled: this.isDisabled(size)
    }))
  )

  onChangeIndex() {
    const size = this.detail().sizeTable[this.activeItemIndex()];
    this.productDetailStore.sizeType.set(this.getName(size));
  }

  getName(size: SizeTable) {
    return size.primary ? 'primary' : size.type
  }

  isDisabled(size: string) {
    console.count('isDisabled');
    return !this.detail().skus.some(sku => sku.size[this.activeType()] === size)
  }
}
