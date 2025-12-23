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
}
