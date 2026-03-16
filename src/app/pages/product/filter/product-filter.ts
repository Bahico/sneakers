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
import {combineLatest, debounceTime, filter, of, Subject, takeUntil} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ProductFilterStore} from '@/product/filter/product-filter-store';
import { ProductCategories } from '@/product/filter/components/categories/product-categories';

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
    TuiActiveZone,
    ProductCategories
  ]
})
export default class ProductFilter implements OnInit, OnDestroy {
  private readonly productService = inject(ProductService);
  protected readonly productFilterStore = inject(ProductFilterStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  protected breadCrumbs = [...PRODUCT_FILTER_BREAD_CRUMBS];
  protected readonly throttle = 200;
  protected readonly scrollDistance = 2;
  protected readonly sorts = SORT;

  protected readonly caption = signal('');
  protected readonly genderName = signal('');
  protected readonly currentPage = signal(1);
  protected readonly openFilter = signal(false);

  private fullPath: string[] = [];
  private gender$ = signal<Gender>('male');
  protected readonly search = signal('');
  protected readonly sortOpen = signal(false);
  protected readonly timeStable = signal(false);
  protected readonly mode = signal<'category' | 'search'>('category');
  protected readonly openFilters = signal({
    size: true,
    brand: true,
  });

  products = signal<ProductListDetailModel[]>([]);

  private readonly productRequestDestroyer = new Subject<void>();

  constructor() {
    this.onFilterOpenHidden();

    afterNextRender(() => {
      this.mode.set(this.route.snapshot.data['mode']);
      this.search.set(this.route.snapshot.queryParams['search'] || '');
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
    this.productRequestDestroyer.next();
    this.productRequestDestroyer.complete();
    this.productFilterStore.filter.reset({brand_ids: [], sizes: []});
  }

  onFilterOpenHidden() {
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

  subscribeEvents() {
    combineLatest([this.router.events, this.route.children[0]?.url || of([])])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(500)
      )
      .subscribe(([_, segments]) => {
        this.loadCategory(segments);
        this.initialLoad();
      })
  }

  subscribeFilter() {
    this.productFilterStore.filter.valueChanges
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
    this.productRequestDestroyer.next();
    this.loadProduct();
  }

  loadCategory(segments: UrlSegment[]) {
    this.gender$.set(<Gender>this.route.snapshot.params['gender']);
    this.fullPath = segments?.map(s => s.path);
    this.updateBreadcrumbs();

    this.getBrands();
    this.getSizeTables();
  }

  loadProduct() {
    this.productService
      .query(this.rowFilter)
      .pipe(takeUntil(this.productRequestDestroyer), takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.products.update(items => [...items, ...res.products]);

        if (this.productFilterStore.maxPrice() === 0) {
          this.productFilterStore.maxPrice.set(res.max_price);
          this.productFilterStore.minPrice.set(res.min_price);
        }
      })
  }

  get rowFilter() {
    const rawFilter = this.productFilterStore.filter.getRawValue();
    const filter = {
      page: this.currentPage(),
      limit: 20,
      category_slug: this.genderCategory,
      fit: this.genderApposite?.toUpperCase(),
      ...rawFilter,
      min_max_price: Array.isArray(rawFilter.min_max_price) ? rawFilter.min_max_price : [],
      sizes: Array.isArray(rawFilter.sizes) ? rawFilter.sizes : [],
      brand_ids: Array.isArray(rawFilter.brand_ids) ? rawFilter.brand_ids : [],
      search: this.search()
    };

    for (const key in filter) {
      if (filter[key] === undefined || !filter[key]) {
        delete filter[key];
      }
    }

    return filter
  }

  get genderCategory() {
    return this.gender + '/' + this.fullPath.join('/');
  }

  get gender() {
    const gender = this.gender$();
    return ((gender === 'male' || gender === 'men') ? 'men' : gender === 'female' || gender === 'women' ? 'women' : 'products');
  }

  get genderApposite() {
    const gender = this.gender$();
    return ((gender === 'male' || gender === 'men') ? 'male' : gender === 'female' || gender === 'women' ? 'female' : 'unisex');
  }

  private updateBreadcrumbs() {
    const gender = this.gender$();

    const genderCaptionMap: Record<Gender, string> = {
      male: 'Мужское',
      men: 'Мужское',
      female: 'Женское',
      women: 'Женское',
      child: 'Детское',
      unisex: 'Унисекс',
    };

    const typeCaptionMap: Record<string, string> = {
      accessories: 'Аксессуары',
      footwear: 'Обувь',
      apparel: 'Одежда',
    };

    const typeSlug = this.fullPath.find((segment) =>
      ['accessories', 'footwear', 'apparel'].includes(segment),
    );

    this.caption.set(typeSlug
      ? typeCaptionMap[typeSlug] ?? (typeSlug.charAt(0).toUpperCase() + typeSlug.slice(1))
      : '');
    this.genderName.set(genderCaptionMap[gender]);
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
        category_slug: this.genderCategory
      })
      // Use takeUntilDestroyed only - won't be cancelled by filter changes
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.productFilterStore.brands.set(res);
      })
  }

  getSizeTables() {
    this.productService
      .sizes({
        category_slug: this.fullPath.join('/')
      })
      // Use takeUntilDestroyed only - won't be cancelled by filter changes
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.productFilterStore.sizeTables.set(res.size_table);
      })
  }

  detailChange(detail: ProductListDetailModel, $index: number) {
    this.products.update(products => {
      const newProducts = [...products];
      newProducts[$index] = detail;
      return newProducts;
    });
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
