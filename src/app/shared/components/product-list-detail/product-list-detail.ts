import {Component, input} from '@angular/core';
import {ProductListDetailModel} from '@/models/product.model';
import {IconComponent} from '@/components/icon/icon';
import {AsyncPipe, DecimalPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TuiFormatNumberPipe} from '@taiga-ui/core';

@Component({
  selector: 'product-list-detail',
  templateUrl: 'product-list-detail.html',
  imports: [
    IconComponent,
    DecimalPipe,
    RouterLink,
    AsyncPipe,
    TuiFormatNumberPipe
  ],
  host: {class: 'h-80'}
})
export class ProductListDetail {
  detail = input.required<ProductListDetailModel>();
}
