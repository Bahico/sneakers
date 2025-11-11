import {Component, input} from '@angular/core';
import {ProductListDetailModel} from '@/models/product.model';
import {AsyncPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TuiFormatNumberPipe, TuiIcon} from '@taiga-ui/core';

@Component({
  selector: 'product-list-detail',
  templateUrl: 'product-list-detail.html',
  imports: [
    RouterLink,
    AsyncPipe,
    TuiFormatNumberPipe,
    TuiIcon
  ],
  host: {class: 'h-80'}
})
export class ProductListDetail {
  detail = input.required<ProductListDetailModel>();
}
