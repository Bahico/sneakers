import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ProductService} from '@/services/product.service';
import {ActivatedRoute} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';

@Component({
  templateUrl: 'product-detail.component.html'
})
export default class ProductDetailComponent implements OnInit, OnDestroy {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);

  private readonly destroy$ = new Subject<void>();

  ngOnInit() {
    this.subscribeRoute();
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
