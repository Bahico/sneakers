import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TuiCheckbox, TuiTab, TuiTabsHorizontal} from '@taiga-ui/kit';
import {SIZE_TABLE, SIZES} from '@/product/filter/product-filter.constans';

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

  protected readonly sizes = SIZES;
  protected readonly sizeTable = SIZE_TABLE;
}
