import {afterNextRender, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ProductService} from '@/services/product.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ProductDetailImagesComponent} from './components/images/product-detail-images.component';
import {ProductDetailOrderComponent} from './components/order/product-detail-order.component';
import {ProductDetailNameComponent} from './components/name/product-detail-name.component';
import {ProductDetailSizeComponent} from './components/size/product-detail-size.component';
import {ProductDetailColorComponent} from '@/product/detail/components/color/product-detail-color.component';
import {ConnectInfosComponent} from '@/product/detail/components/connect-infos/connect-infos.component';
import {TuiBreadcrumbs} from '@taiga-ui/kit';
import {TuiItem} from '@taiga-ui/cdk';
import {TuiLink} from '@taiga-ui/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';

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
    ConnectInfosComponent,
    TuiBreadcrumbs,
    TuiItem,
    TuiLink,
    RouterLink
  ]
})
export default class ProductDetailComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected items = [
    {
      caption: 'Selects',
      routerLink: '/components/select',
    },
    {
      caption: 'Multi',
      routerLink: '/components/multi-select',
    },
    {
      caption: 'With tags',
      routerLink: '/components/multi-select',
    },
    {
      caption: 'Current',
      routerLink: '/navigation/breadcrumbs',
    },
  ];

  constructor() {
    afterNextRender(() => {
      this.subscribeRoute();
    })
  }


  ngOnInit() {
    console.log('ProductDetailComponent');
  }

  subscribeRoute() {
    this.route
      .params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        if (params['spuId']) {
          this.loadProduct(params['spuId'])
        }
      })
  }

  loadProduct(spuId: number) {
    console.log(spuId);
    this.productService
      .detail(spuId)
      .pipe(map(res => {
        console.log(res)
        return res
      }))
      .subscribe(res => {
        console.log(res);
      }, error => console.log(error))
  }
}
