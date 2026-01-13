import {Component, DestroyRef, inject, signal} from '@angular/core';
import {IconComponent} from '@/components/icon/icon';
import {ProductListDetail} from '@/components/product-list-detail/product-list-detail';
import {ProductListDetailModel} from '@/models/product.model';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ProductService} from '@/services/product.service';
import {FormsModule} from '@angular/forms';

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

  loadProduct() {
    this.productService
      .query(this.rowFilter)
      .pipe(takeUntilDestroyed(this.destroyRef))
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
