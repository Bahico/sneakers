import {Component, DestroyRef, effect, inject, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {TuiBreadcrumbs, TuiRadioComponent} from '@taiga-ui/kit';
import {TuiDropdown, TuiLink} from '@taiga-ui/core';
import {TuiActiveZone, TuiItem, TuiObscured} from '@taiga-ui/cdk';
import {ActivatedRoute, NavigationEnd, Router, RouterLink, UrlSegment} from '@angular/router';
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
import {isPlatformBrowser, NgOptimizedImage} from '@angular/common';
import {Gender} from '@/models/gender';
import {filter} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ProductFilterStore} from '@/product/filter/product-filter-store';

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
  private readonly productFilterService = inject(ProductFilterStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly items = PRODUCT_FILTER_BREAD_CRUMBS;
  protected readonly throttle = 10;
  protected readonly scrollDistance = 2;
  protected readonly sorts = SORT;

  currentPage = signal(1);
  protected readonly sort = signal(SORT[0]);
  protected readonly openFilter = signal(false);
  private fullPath: string[] = [];
  private gender: Gender = 'male';
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
    if (isPlatformBrowser(this.platformId)) {
      this.subscribeRouteChange();
      this.loadCategory();
    }
  }

  subscribeRouteChange() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((_) => {
        this.currentPage.set(1);
        this.products.set([]);

        this.loadCategory();
      })
  }

  loadCategory() {
    this.gender = <Gender>this.route.snapshot.params['gender'];

    this.route.children[0].url.subscribe((segments: UrlSegment[]) => {
      this.fullPath = segments.map(s => s.path);
      this.loadProduct(true);
      this.getBrands();
      this.getSizeTables();
    });
  }

  loadProduct(initial = false) {
    this.productService
      .query(this.rowFilter)
      .subscribe(res => {
        this.products.update(items => [...items, ...res.products]);

        if (initial) {
          this.productFilterService.maxPrice.set(res.max_price);
          this.productFilterService.minPrice.set(res.min_price);
          this.productFilterService.filter.minMax().setControlValue([res.min_price, res.max_price]);
        }
      })
  }

  get rowFilter() {
    const filter = {
      page: this.currentPage(),
      limit: 20,
      category_slug: this.fullPath.join('/'),
      fit: this.gender.toUpperCase()
    }

    if (this.sort().key) {
      filter['sort_by'] = this.sort().key
    }
    return filter
  }

  nextPage() {
    this.currentPage.update(page => page + 1);
    this.loadProduct();
  }

  changeOpen(key: string) {
    this.openFilters.update(filters => ({
        ...filters,
        [key]: !filters[key]
      })
    );
  }

  getBrands() {
    this.productService
      .brands({
        limit: 100,
        category_slug: this.fullPath.join('/')
      })
      .subscribe(res => {
        this.productFilterService.brands.set(res);
      })
  }

  getSizeTables() {
    this.productService
      .sizes({
        category_slug: this.fullPath.join('/')
      })
      .subscribe(res => {
        this.productFilterService.sizeTables.set(res.size_table);
      })
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
