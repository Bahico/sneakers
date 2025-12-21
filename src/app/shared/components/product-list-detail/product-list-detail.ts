import {afterNextRender, Component, inject, input, signal} from '@angular/core';
import {ProductListDetailModel} from '@/models/product.model';
import {AsyncPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TuiFormatNumberPipe, TuiIcon} from '@taiga-ui/core';
import {ResponsiveBreakpointsService} from '@/services/responsive-breakpoints.service';

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
  private readonly rbs = inject(ResponsiveBreakpointsService);

  detail = input.required<ProductListDetailModel>();
  onHome = input(false);
  isMobile = this.rbs.isMobile;
}
