import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {TuiBreadcrumbs, TuiRadioComponent} from '@taiga-ui/kit';
import {TuiDropdown, TuiLink} from '@taiga-ui/core';
import {TuiActiveZone, TuiItem, TuiObscured} from '@taiga-ui/cdk';
import {RouterLink} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IconComponent} from '@/components/icon/icon';
import {PRODUCT_FILTER_BREAD_CRUMBS, SORT} from '@/product/filter/product-filter.constans';
import {ProductListDetailModel} from '@/models/product.model';
import {ProductService} from '@/services/product.service';
import {ProductListDetail} from '@/components/product-list-detail/product-list-detail';
import {ProductFilterPrice} from '@/product/filter/components/price/product-filter-price';
import {ProductFilterSize} from '@/product/filter/components/size/product-filter-size';
import {ProductFilterBrand} from '@/product/filter/components/brand/product-filter-brand';
import {MobileFilter} from '@/product/filter/components/mobile-filter/mobile-filter';
import {InfiniteScrollDirective} from 'ngx-infinite-scroll';
import {ProductFilterStore} from '@/product/filter/product-filter-store';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'product-filter',
  templateUrl: 'product-filter.html',
  host: {class: 'flex w-full justify-center'},
  imports: [
    TuiBreadcrumbs,
    TuiLink,
    TuiItem,
    RouterLink,
    ReactiveFormsModule,
    IconComponent,
    FormsModule,
    ProductListDetail,
    ProductFilterPrice,
    ProductFilterSize,
    ProductFilterBrand,
    MobileFilter,
    InfiniteScrollDirective,
    NgOptimizedImage,
    TuiRadioComponent,
    TuiDropdown,
    TuiObscured,
    TuiActiveZone
  ]
})
export default class ProductFilter implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly productFilterStore = inject(ProductFilterStore);

  protected readonly items = PRODUCT_FILTER_BREAD_CRUMBS;
  protected readonly throttle = 10;
  protected readonly scrollDistance = 2;
  protected readonly sorts = SORT;

  protected readonly sort = signal(SORT[0]);
  protected readonly openFilter = signal(false);
  protected open = false;
  protected readonly openFilters = signal({
    size: true,
    brand: true,
  });

  products = signal<ProductListDetailModel[]>([]);

  constructor() {
    effect(() => {
      if (typeof document === 'undefined' || !document.body) {
        return;
      }

      if (this.openFilter()) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  ngOnInit() {
    this.loadProduct();
  }

  loadProduct() {
    this.productService
      .query({
        page: this.productFilterStore.currentPage()
      })
      .subscribe(res => {
        this.products.update(items => [...items, ...res.results]);
        // this.products.update(items => res.results);
      })
  }

  nextPage() {
    this.productFilterStore.currentPage.update(page => page + 1);
    this.loadProduct();
  }

  changeOpen(key: string) {
    this.openFilters.update(filters => ({
        ...filters,
        [key]: !filters[key]
      })
    );
  }

  protected onClick(): void {
    this.open = !this.open;
  }

  protected onObscured(obscured: boolean): void {
    if (obscured) {
      this.open = false;
    }
  }

  protected onActiveZone(active: boolean): void {
    this.open = active && this.open;
  }
}
