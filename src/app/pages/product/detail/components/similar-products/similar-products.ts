import { Component, computed, inject, input } from '@angular/core';
import { ProductListDetail } from '@/components/product-list-detail/product-list-detail';
import { ProductDetailStore } from '@/product/detail/services/product-detail-store';
import { RouterLink } from '@angular/router';

@Component({
  templateUrl: 'similar-products.html',
  selector: 'similar-products',
  imports: [
    ProductListDetail,
    RouterLink
  ]
})
export class SimilarProducts {
  private readonly productDetailStore = inject(ProductDetailStore);

  gender = input.required<string>();

  products = this.productDetailStore.similar;
  category = computed(() => this.productDetailStore.detail().category)
}
