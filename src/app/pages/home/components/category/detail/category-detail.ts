import {Component, ElementRef, inject, viewChild} from '@angular/core';
import {ProductService} from '@/services/product.service';
import {ProductListDetail} from '@/components/product-list-detail/product-list-detail';
import { ProductListDetailModel } from '@/models/product.model';


@Component({
  templateUrl: 'category-detail.html',
  selector: 'category-detail',
  host: {class: 'my-10 flex'},
  imports: [
    ProductListDetail
  ]
})
export class CategoryDetail {
  private readonly productService = inject(ProductService);

  products = this.productService.products;

  scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  previous() {
    const container = this.scrollContainer()?.nativeElement;
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  next() {
    const container = this.scrollContainer()?.nativeElement;
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  detailChange(detail: ProductListDetailModel, $index: number) {
    this.productService.setProducts(this.products().map((product, index) => index === $index ? detail : product));
  }
}
