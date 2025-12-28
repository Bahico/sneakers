import {
  afterNextRender,
  Component,
  DestroyRef,
  effect,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal
} from '@angular/core';
import {TuiBreadcrumbs, TuiRadioComponent} from '@taiga-ui/kit';
import {TuiDropdown, TuiLink} from '@taiga-ui/core';
import {TuiActiveZone, TuiItem, TuiObscured} from '@taiga-ui/cdk';
import {ActivatedRoute, Router, RouterLink, UrlSegment} from '@angular/router';
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
import {combineLatest, debounceTime, filter, Subject, takeUntil} from 'rxjs';
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
export default class ProductFilter implements OnInit, OnDestroy {
  private readonly productService = inject(ProductService);
  protected readonly productFilterStore = inject(ProductFilterStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly items = PRODUCT_FILTER_BREAD_CRUMBS;
  protected readonly throttle = 10;
  protected readonly scrollDistance = 2;
  protected readonly sorts = SORT;

  protected readonly currentPage = signal(1);
  protected readonly openFilter = signal(false);

  private fullPath: string[] = [];
  private gender: Gender = 'male';
  protected readonly sortOpen = signal(false);
  protected readonly timeStable = signal(false);
  protected readonly openFilters = signal({
    size: true,
    brand: true,
  });

  products = signal<ProductListDetailModel[]>([]);

  private readonly destroyer = new Subject<void>();

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

    afterNextRender(() => {
      setTimeout(() => {
        this.timeStable.set(true);
      }, 1000)
    })
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.subscribeEvents();
      this.subscribeFilter();
    }
  }

  ngOnDestroy() {
    this.destroyer.next();
    this.productFilterStore.filter.reset();
  }

  subscribeEvents() {
    combineLatest([this.router.events, this.route.children[0].url])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(500)
      )
      .subscribe(([_, segments]) => {
        this.initialLoad();
        this.loadCategory(segments);
      })
  }

  subscribeFilter() {
    combineLatest([this.productFilterStore.filter.valueChanges])
      .pipe(
        filter(() => this.timeStable()),
        takeUntilDestroyed(this.destroyRef),
        debounceTime(500)
      )
      .subscribe(() => {
        this.initialLoad();
      })
  }

  initialLoad() {
    this.currentPage.set(1);
    this.products.set([]);
    this.destroyer.next();
    this.loadProduct(true);
  }

  loadCategory(segments: UrlSegment[]) {
    this.gender = <Gender>this.route.snapshot.params['gender'];

    this.fullPath = segments.map(s => s.path);
    this.getBrands();
    this.getSizeTables();
  }

  loadProduct(initial = false) {
    this.productService
      .query(this.rowFilter)
      .pipe(takeUntil(this.destroyer))
      .subscribe(res => {
        this.products.update(items => [...items, ...res.products]);

        if (initial) {
          this.productFilterStore.maxPrice.set(res.max_price);
          this.productFilterStore.minPrice.set(res.min_price);
        }
      })
  }

  get rowFilter() {
    const filter = {
      page: this.currentPage(),
      limit: 20,
      category_slug: this.fullPath.join('/'),
      fit: this.gender.toUpperCase(),
      ...this.productFilterStore.filter.getRawValue()
    }

    const sortBy = filter.sort_by;
    if (!sortBy) {
      delete filter.sort_by;
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
      .pipe(takeUntil(this.destroyer), takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.productFilterStore.brands.set(res);
      })
  }

  getSizeTables() {
    this.productService
      .sizes({
        category_slug: this.fullPath.join('/')
      })
      .pipe(takeUntil(this.destroyer), takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.productFilterStore.sizeTables.set(res.size_table);
      })
  }

  protected onClick(): void {
    this.sortOpen.set(!this.sortOpen());
  }

  protected onObscured(obscured: boolean): void {
    if (obscured) {
      this.sortOpen.set(false);
    }
  }

  protected onActiveZone(active: boolean): void {
    this.sortOpen.set(active && this.sortOpen());
  }
}
