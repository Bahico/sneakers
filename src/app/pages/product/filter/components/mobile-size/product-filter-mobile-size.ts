import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TuiTab, TuiTabsHorizontal} from '@taiga-ui/kit';
import {SIZE_TABLE, SIZES} from '@/product/filter/product-filter.constans';

@Component({
  templateUrl: 'product-filter-mobile-size.html',
  selector: 'product-filter-mobile-size',
  imports: [
    ReactiveFormsModule,
    TuiTab,
    TuiTabsHorizontal,
    FormsModule
  ]
})
export class ProductFilterMobileSize {
  protected readonly sizes = SIZES;
  protected readonly sizeTable = SIZE_TABLE;
}
