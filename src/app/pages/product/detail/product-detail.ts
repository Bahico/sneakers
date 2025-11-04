import {afterNextRender, Component, DestroyRef, inject, ViewEncapsulation} from '@angular/core';
import {ProductService} from '@/services/product.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ProductDetailImages} from './components/images/product-detail-images';
import {ProductDetailOrder} from './components/order/product-detail-order';
import {ProductDetailName} from './components/name/product-detail-name';
import {ProductDetailSize} from './components/size/product-detail-size';
import {ProductDetailColor} from '@/product/detail/components/color/product-detail-color';
import {ConnectInfos} from '@/product/detail/components/connect-infos/connect-infos';
import {TuiBreadcrumbs} from '@taiga-ui/kit';
import {TuiItem} from '@taiga-ui/cdk';
import {TuiLink} from '@taiga-ui/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ProductDetailStore} from '@/product/detail/services/product-detail-store';

@Component({
  templateUrl: 'product-detail.html',
  selector: 'product-detail',
  host: {class: 'flex w-full justify-center'},
  imports: [
    ProductDetailImages,
    ProductDetailOrder,
    ProductDetailName,
    ProductDetailSize,
    ProductDetailColor,
    ConnectInfos,
    TuiBreadcrumbs,
    TuiItem,
    TuiLink,
    RouterLink
  ]
})
export default class ProductDetail {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly productDetailStore = inject(ProductDetailStore);

  protected items = [
    {
      caption: 'Главная',
      routerLink: '/',
    },
    {
      caption: 'Current'
    },
  ];


  constructor() {
    afterNextRender(() => {
      this.subscribeRoute();
    })
  }

  subscribeRoute() {
    this.route
      .params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        if (params['spuId']) {
          this.loadProduct(params['spuId']);
        }
      })
  }

  loadProduct(spuId: number) {
    this.productService
      .detail(spuId)
      .subscribe(res => {
        this.productDetailStore.update = res;
        const size = res.sizeTable[0];
        this.productDetailStore.sizeType.set(size.primary ? 'primary' : size.type);
        this.items[1] = {
          caption:res.name
        }
      })
  }
}
