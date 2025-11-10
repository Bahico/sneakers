import {Component, inject, OnInit, signal} from '@angular/core';
import {TuiBreadcrumbs, TuiCheckbox, TuiRange, TuiTab, TuiTabsHorizontal} from '@taiga-ui/kit';
import {TuiLink} from '@taiga-ui/core';
import {TuiItem} from '@taiga-ui/cdk';
import {RouterLink} from '@angular/router';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IconComponent} from '@/components/icon/icon';
import {BRANDS, PRODUCT_FILTER_BREAD_CRUMBS, SIZE_TABLE, SIZES} from '@/product/filter/product-filter.constans';
import {ProductListDetailModel, ProductModel} from '@/models/product.model';
import {ProductService} from '@/services/product.service';
import {ProductListDetail} from '@/components/product-list-detail/product-list-detail';

@Component({
  selector: 'product-filter',
  templateUrl: 'product-filter.html',
  host: {class: 'flex w-full justify-center'},
  imports: [
    TuiBreadcrumbs,
    TuiLink,
    TuiItem,
    RouterLink,
    TuiRange,
    ReactiveFormsModule,
    IconComponent,
    TuiTab,
    TuiTabsHorizontal,
    TuiCheckbox,
    FormsModule,
    ProductListDetail
  ]
})
export default class ProductFilter implements OnInit {
  private readonly productService = inject(ProductService);

  protected readonly sizes = SIZES;
  protected readonly sizeTable = SIZE_TABLE;
  protected readonly items = PRODUCT_FILTER_BREAD_CRUMBS;
  protected readonly brands = BRANDS;

  protected readonly formControl = new FormControl([4, 6]);

  protected readonly openFilters = signal({
    size: false,
    brand: false,
  });

  products = signal<ProductListDetailModel[]>([]);

  ngOnInit() {
    this.productService
      .query({})
      .subscribe(res => {
        this.products.set(res.results);
      })
  }

  changeOpen(key: string) {
    this.openFilters.update(filters => ({
        ...filters,
        [key]: !filters[key]
      })
    );
  }
}
