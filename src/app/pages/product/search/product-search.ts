import {afterNextRender, Component, DestroyRef, inject, signal} from '@angular/core';
import {IconComponent} from '@/components/icon/icon';
import {ProductListDetail} from '@/components/product-list-detail/product-list-detail';
import {ProductListDetailModel} from '@/models/product.model';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ProductService} from '@/services/product.service';
import {FormsModule} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';

@Component({
  templateUrl: 'product-search.html',
  selector: 'product-search',
  imports: [
    IconComponent,
    ProductListDetail,
    FormsModule
  ]
})
export default class ProductSearch {
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  search = signal<string>('');
  products = signal<ProductListDetailModel[]>([]);
  frequentlySearched = signal<ProductListDetailModel[]>([]);

  private readonly destroy$ = new Subject<void>();

  constructor() {
    afterNextRender(() => {
      this.loadFrequentlySearched();
    })
  }

  loadFrequentlySearched() {
    this.productService
      .frequentlySearched({limit: 20})
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.frequentlySearched.set(res.products);
      })
  }

  loadProduct() {
    this.destroy$.next();
    this.productService
      .query(this.rowFilter)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        takeUntil(this.destroy$)
      )
      .subscribe(res => {
        this.products.set(res.products);
      })
  }

  get rowFilter() {
    return {
      search: this.search(),
      limit: 20,
      page: 1,
    }
  }

  detailChange(detail: ProductListDetailModel, $index: number) {
    this.products.update(products => {
      const newProducts = [...products];
      newProducts[$index] = detail;
      return newProducts;
    });
  }
}
