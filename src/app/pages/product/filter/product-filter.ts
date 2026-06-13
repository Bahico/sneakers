import { IconComponent } from '@/components/icon/icon';
import { ProductListDetail } from '@/components/product-list-detail/product-list-detail';
import { Gender } from '@/models/gender';
import { ProductListDetailModel } from '@/models/product.model';
import { ProductFilterBrand } from '@/product/filter/components/brand/product-filter-brand';
import { ProductCategories } from '@/product/filter/components/categories/product-categories';
import { MobileFilter } from '@/product/filter/components/mobile-filter/mobile-filter';
import { ProductFilterPrice } from '@/product/filter/components/price/product-filter-price';
import { ProductFilterSize } from '@/product/filter/components/size/product-filter-size';
import { ProductFilterStore } from '@/product/filter/product-filter-store';
import { SORT } from '@/product/filter/product-filter.constans';
import { ProductService } from '@/services/product.service';
import { isPlatformBrowser } from '@angular/common';
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
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, UrlSegment } from '@angular/router';
import { TuiActiveZone, TuiItem, TuiObscured } from '@taiga-ui/cdk';
import { TuiDropdown, TuiLink } from '@taiga-ui/core';
import { TuiBreadcrumbs, TuiRadioComponent } from '@taiga-ui/kit';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { combineLatest, debounceTime, filter, finalize, map, of, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'product-filter',
  templateUrl: 'product-filter.html',
  host: { class: 'flex w-full justify-center' },
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

  protected readonly throttle = 200;
  protected readonly scrollDistance = 2;
  protected readonly pageSize = 20;
  protected readonly sorts = SORT;

  protected readonly caption = signal('');
  protected readonly genderName = signal('');
  protected readonly currentPage = signal(1);
  protected readonly openFilter = signal(false);
  protected readonly loading = signal(false);
  protected readonly initialLoading = signal(false);
  protected readonly hasMore = signal(true);

  protected categoryName = signal<string>(null);
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

  promoCards = rxResource({
    stream: () => this.productService.promoCards().pipe(map(data => data.promo_cards))
  })

  private readonly productRequestDestroyer = new Subject<void>();

  constructor() {
    this.onFilterOpenHidden();

    afterNextRender(() => {
      this.mode.set(this.route.snapshot.data['mode']);
      this.search.set(this.route.snapshot.queryParams['search'] || '');
      this.loadCategory();
      this.initialLoad();
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
    this.productFilterStore.filter.reset({ brand_ids: [], sizes: [] });
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
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
        debounceTime(500)
      )
      .subscribe(() => {
        this.loadCategory();
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
    this.hasMore.set(true);
    this.products.set([]);
    this.productRequestDestroyer.next();
    this.loading.set(false);
    this.initialLoading.set(false);
    this.loadProduct(true);
  }

  loadCategory() {
    this.gender$.set(<Gender>this.route.snapshot.params['gender']);
    this.categoryName.set(this.route.snapshot.params['category']);
    this.updateBreadcrumbs();

    this.getBrands();
    this.getSizeTables();
  }

  loadProduct(initial = false) {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.initialLoading.set(initial);

    this.productService
      .query(this.rowFilter)
      .pipe(
        takeUntil(this.productRequestDestroyer),
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading.set(false);
          this.initialLoading.set(false);
        })
      )
      .subscribe(res => {
        this.hasMore.set(res.products.length >= this.pageSize);

        if (this.currentPage() === 1) {
          this.products.set(res.products);
        } else {
          this.products.update(items => [...items, ...res.products]);
        }

        if (this.productFilterStore.maxPrice() === 0 || initial) {
          this.productFilterStore.maxPrice.set(res.max_price);
          this.productFilterStore.minPrice.set(res.min_price);
        }
      })
  }

  get rowFilter() {
    const rawFilter = this.productFilterStore.filter.getRawValue();
    const filter = {
      page: this.currentPage(),
      limit: this.pageSize,
      category_name_search: this.categoryNameSearch(),
      fit: this.genderApposite?.toUpperCase(),
      ...rawFilter,
      min_price: rawFilter.min_max_price?.[0],
      max_price: rawFilter.min_max_price?.[1],
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

  get gender() {
    const gender = this.gender$();
    return ((gender === 'male' || gender === 'men') ? 'men' : gender === 'female' || gender === 'women' ? 'women' : 'products');
  }

  protected categoryNameSearch() {
    const categoryName = this.categoryName();
    const categoryNameSearchMap: Record<string, string> = {
      'Сланцы, сандалии, сабо, мюле': 'Тапки',
    };

    return categoryNameSearchMap[categoryName] ?? categoryName;
  }

  protected categorySlug() {
    const categoryName = this.categoryName();
    const categorySlugMap: Record<string, string> = {
      'Обувь': 'footwear',
      'Одежда': 'apparel',
      'Аксессуары': 'accessories',
      'Кроссовки': 'footwear/sneakers',
      'Сланцы, сандалии, сабо, мюле': 'footwear/slippers',
    };

    return categorySlugMap[categoryName] ?? categoryName;
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

    const typeSlug = this.categoryName();

    this.caption.set(this.categoryName());
    this.genderName.set(genderCaptionMap[gender]);
  }

  nextPage() {
    if (this.loading()) {
      return;
    }

    if (!this.hasMore()) {
      return;
    }

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
        // limit: 100,
        category_name_search: this.categoryNameSearch()
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
        category_slug: this.categorySlug()
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
