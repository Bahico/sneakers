import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  inject, Injector,
  OnDestroy, OnInit, PLATFORM_ID,
  runInInjectionContext,
  signal
} from '@angular/core';
import {ProductService} from '@/services/product.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ProductDetailImages} from './components/images/product-detail-images';
import {ProductDetailOrder} from './components/order/product-detail-order';
import {ProductDetailName} from './components/name/product-detail-name';
import {ProductDetailSize} from './components/size/product-detail-size';
import {ConnectInfos} from '@/product/detail/components/connect-infos/connect-infos';
import {TuiBreadcrumbs} from '@taiga-ui/kit';
import {TuiItem} from '@taiga-ui/cdk';
import {TuiLink} from '@taiga-ui/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ProductDetailStore} from '@/product/detail/services/product-detail-store';
import {finalize} from 'rxjs';
import {ProductDetailColor} from '@/product/detail/components/color/product-detail-color';
import {CommentList} from '@/product/detail/components/comment/comment-list';
import {SimilarProducts} from '@/product/detail/components/similar-products/similar-products';
import {isPlatformBrowser} from '@angular/common';

@Component({
  templateUrl: 'product-detail.html',
  selector: 'product-detail',
  host: {class: 'flex w-full justify-center'},
  imports: [
    ProductDetailImages,
    ProductDetailOrder,
    ProductDetailName,
    ProductDetailSize,
    ConnectInfos,
    TuiBreadcrumbs,
    TuiItem,
    TuiLink,
    RouterLink,
    ProductDetailColor,
    CommentList,
    SimilarProducts
  ]
})
export default class ProductDetail implements OnDestroy, OnInit {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly productDetailStore = inject(ProductDetailStore);
  private readonly injector = inject(Injector);
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.subscribeRoute();
    }
  }

  ngOnDestroy() {
    this.productDetailStore.clear();
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
        runInInjectionContext(this.injector, () => {
          this.productDetailStore.update = res;
          const size = res.sizeTable[0];
          this.productDetailStore.sizeType.set(size.primary ? 'primary' : size.type);
        })
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
        this.productDetailStore.updateSimilar = res.products.splice(0, 8);
      })
  }
}
