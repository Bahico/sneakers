import {Component, computed, inject, model} from '@angular/core';
import {TuiTabs} from '@taiga-ui/kit';
import {NgClass} from '@angular/common';
import {ProductDetailStore} from '@/product/detail/services/product-detail-store';
import {SizeTable} from '@/models/size-table.model';
import {CartStore} from '@/cart';
import {Router} from '@angular/router';
import {Variant} from '@/models/product.model';
import {DialogService} from '@/services/dialog.service';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {ContactsProduct} from '@/product/detail/components/contacts/contacts-product';

@Component({
  selector: 'product-detail-size',
  templateUrl: 'product-detail-size.html',
  imports: [
    TuiTabs,
    NgClass
  ],
})
export class ProductDetailSize {
  private readonly productDetailStore = inject(ProductDetailStore);
  private readonly dialog = inject(DialogService);
  private readonly cartStore = inject(CartStore);
  private readonly router = inject(Router)

  protected readonly detail = this.productDetailStore.detail;
  protected readonly active = this.productDetailStore.sizeValue;
  protected readonly activeType = this.productDetailStore.sizeType;
  protected readonly activeItemIndex = model<number>(0);

  protected readonly sizeTable = computed(() =>
    this.detail()?.size_table?.filter(size =>
      this.detail().variants.some(sku => sku.size[this.getName(size).toLowerCase()])
    )
  );

  protected readonly sizes = computed(() =>
    this.sizeTable()?.[this.activeItemIndex()]?.values?.map(size => {
      const sku = this.getSku(size);
      return {
        value: size,
        disabled: !sku,
        added: sku && this.added(sku)
      }
    })
  )

  onChangeIndex() {
    const size = this.sizeTable()[this.activeItemIndex()];
    this.productDetailStore.sizeType.set(this.getName(size));
  }

  getName(size: SizeTable) {
    return size.primary ? 'primary' : size.type
  }

  getSku(size: string) {
    return this.detail().variants.find(sku => sku.size[this.activeType().toLowerCase()] === size)
  }

  added(variant: Variant) {
    return this.cartStore.carts()?.items?.some(item => item.variant.id === variant.id)
  }

  clickInfoSize() {
    if (this.detail().category.full_slug.includes('footwear')) {
      this.router.navigateByUrl('information/choose-size').then();
    } else {
      this.dialog.open(
        new PolymorpheusComponent(ContactsProduct),
        {
          label: null,
          size: 's'
        },
      ).subscribe()
    }
  }

  getSizeValue(value: string) {
    if (value.includes('(')) {
      return value.split('(')[1].replace(')', '');
    }
    return value;
  }
}
