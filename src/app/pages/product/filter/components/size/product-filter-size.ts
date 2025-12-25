import {Component, inject, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TuiCheckbox, TuiTab, TuiTabsHorizontal} from '@taiga-ui/kit';
import {ProductFilterStore} from '@/product/filter/product-filter-store';

@Component({
  templateUrl: 'product-filter-size.html',
  selector: 'product-filter-size',
  imports: [
    ReactiveFormsModule,
    TuiCheckbox,
    TuiTab,
    TuiTabsHorizontal,
    FormsModule
  ]
})
export class ProductFilterSize {
  protected readonly productFilterStore = inject(ProductFilterStore);

  protected readonly sizeTables = this.productFilterStore.sizeTables;
  protected readonly activeIndex = signal(0);

  checkSize(id: string) {
    return this.productFilterStore.filter.controls.sizes.value.includes(id);
  }

  clickSize(id: string) {
    const sizes = this.productFilterStore.filter.controls.sizes.value
    if (this.checkSize(id)) {
      const indexOf = sizes.indexOf(id);
      sizes.splice(indexOf, 1);
    } else {
      sizes.push(id);
    }
    this.productFilterStore.filter.controls.sizes.setValue(sizes);
  }
}
