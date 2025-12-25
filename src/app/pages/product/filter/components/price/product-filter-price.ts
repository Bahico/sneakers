import {Component, effect, inject} from '@angular/core';
import {TuiRange} from '@taiga-ui/kit';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProductFilterStore} from '@/product/filter/product-filter-store';
import {AsyncPipe} from '@angular/common';
import {TuiFormatNumberPipe} from '@taiga-ui/core';
import {map} from 'rxjs';

@Component({
  templateUrl: 'product-filter-price.html',
  selector: 'product-filter-price',
  imports: [
    TuiRange,
    ReactiveFormsModule,
    FormsModule,
    AsyncPipe,
    TuiFormatNumberPipe
  ]
})
export class ProductFilterPrice {
  readonly productFilterStore = inject(ProductFilterStore);

  protected readonly minPrice = this.productFilterStore.filter.controls.min_max_price.valueChanges.pipe(map(item => item[0] as number));
  protected readonly maxPrice = this.productFilterStore.filter.controls.min_max_price.valueChanges.pipe(map(item => item[1] as number));

  constructor() {
    effect(() => {
      this.productFilterStore.filter.controls.min_max_price.setValue([this.productFilterStore.minPrice(), this.productFilterStore.maxPrice()], {emitEvent: false});
    })
  }

}
