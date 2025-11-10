import {computed, Injectable, signal} from '@angular/core';
import {ProductListDetailModel, ProductModel} from '@/models/product.model';
import {Skus} from '@/models/skus.model';

@Injectable({providedIn: 'root'})
export class ProductDetailStore {
  private readonly productDetail$ = signal<Partial<ProductModel>>({});
  private readonly productSimilar$ = signal<ProductListDetailModel[]>([]);

  readonly sizeType = signal<string>(null);
  readonly sizeValue = signal<string>(null);

  readonly selectedSkus = computed<Skus>(() =>
    this.productDetail$().skus?.find(item => item.size[this.sizeType()?.toLowerCase()] === this.sizeValue())
  );

  get detail() {
    return this.productDetail$.asReadonly();
  }

  set update(value: ProductModel) {
    this.productDetail$.set(value);
  }

  get similar() {
    return this.productSimilar$.asReadonly();
  }

  set updateSimilar(value: ProductListDetailModel[]) {
    this.productSimilar$.set(value);
  }
}
