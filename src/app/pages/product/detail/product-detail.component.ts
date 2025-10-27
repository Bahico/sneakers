import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ProductService} from '@/services/product.service';
import {ActivatedRoute} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {ProductDetailImagesComponent} from './components/images/product-detail-images.component';
import {ProductDetailOrderComponent} from './components/order/product-detail-order.component';
import {ProductDetailNameComponent} from './components/name/product-detail-name.component';
import {ProductDetailSizeComponent} from './components/size/product-detail-size.component';
import {ProductDetailColorComponent} from '@/product/detail/components/color/product-detail-color.component';
import {ConnectInfosComponent} from '@/product/detail/components/connect-infos/connect-infos.component';

@Component({
  templateUrl: 'product-detail.component.html',
  selector: 'product-detail',
  host: {class: 'flex w-full justify-center'},
  imports: [
    ProductDetailImagesComponent,
    ProductDetailOrderComponent,
    ProductDetailNameComponent,
    ProductDetailSizeComponent,
    ProductDetailColorComponent,
    ConnectInfosComponent
  ]
})
export default class ProductDetailComponent implements OnInit, OnDestroy {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);

  private readonly destroy$ = new Subject<void>();

  ngOnInit() {
    // this.subscribeRoute();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  subscribeRoute() {
    this.route
      .params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['spuId']) {
          this.loadProduct(params['spuId'])
        }
      })
  }

  loadProduct(spuId: number) {
    this.productService
      .detail(spuId)
      .subscribe(res => {
        console.log(res);
      })
  }
}
