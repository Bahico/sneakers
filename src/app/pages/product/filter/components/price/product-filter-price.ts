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

  protected readonly min_max_price = this.productFilterStore.filter.controls.min_max_price;

  constructor() {
    effect(() => {
      this.productFilterStore.filter.controls.min_max_price.setValue([this.productFilterStore.minPrice(), this.productFilterStore.maxPrice()], {emitEvent: false});
    })
  }

}
