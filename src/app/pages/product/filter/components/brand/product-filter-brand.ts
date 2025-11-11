import {Component} from '@angular/core';
import {IconComponent} from '@/components/icon/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TuiCheckbox} from '@taiga-ui/kit';
import {BRANDS} from '@/product/filter/product-filter.constans';

@Component({
  templateUrl: 'product-filter-brand.html',
  selector: 'product-filter-brand',
  imports: [
    IconComponent,
    ReactiveFormsModule,
    TuiCheckbox,
    FormsModule
  ]
})
export class ProductFilterBrand {
  protected readonly brands = BRANDS;
}
