import {afterNextRender, Component, input, signal} from '@angular/core';
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
  ]
})
export class ProductListDetail {
  detail = input.required<ProductListDetailModel>();
  onHome = input(false);
  isMobile = signal(false);

  constructor() {
    afterNextRender(() => {
      if (window?.innerWidth <= 640) {
        this.isMobile.set(true);
      }
    })
  }
}
