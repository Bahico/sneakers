import {Component} from '@angular/core';
import {TuiRange} from '@taiga-ui/kit';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  templateUrl: 'product-filter-price.html',
  selector: 'product-filter-price',
  imports: [
    TuiRange,
    ReactiveFormsModule
  ]
})
export class ProductFilterPrice {
  protected readonly formControl = new FormControl([4, 6]);
}
