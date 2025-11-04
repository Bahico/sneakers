import {afterNextRender, Component, DestroyRef, inject, signal, ViewEncapsulation} from '@angular/core';
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
import {finalize} from 'rxjs';

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

  protected items = signal([
    {
      caption: 'Главная',
      routerLink: '/',
    },
    {
      caption: 'Current'
    },
  ]);


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
      .pipe(finalize(() => this.loadSimilarOnes()))
      .subscribe(res => {
        this.productDetailStore.update = res;
        const size = res.sizeTable[0];
        this.productDetailStore.sizeType.set(size.primary ? 'primary' : size.type);
        this.items.update(items => [
          items[0],
          {
            caption: res.name
          }
        ]);
      })
  }

  loadSimilarOnes() {
    const detail = this.productDetailStore.detail();
    this.productService
      .query({
        category1: detail.category.category1,
        category2: detail.category.category2,
        category3: detail.category.category3,
      })
      .subscribe(res => {
        this.productDetailStore.updateSimilar = res.results;
      })
  }
}
