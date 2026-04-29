import { Component, ElementRef, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { ProductService } from '@/services/product.service';
import { ProductListDetail } from '@/components/product-list-detail/product-list-detail';
import { ProductListDetailModel } from '@/models/product.model';


@Component({
  templateUrl: 'category-detail.html',
  selector: 'category-detail',
  host: { class: 'my-10 flex' },
  imports: [
    ProductListDetail
  ]
})
export class CategoryDetail implements OnInit {
  private readonly productService = inject(ProductService);

  category_search = input.required<string>();
  products = signal<ProductListDetailModel[]>([]);

  scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  ngOnInit() {
    this.productService.lastSold({ category_search: this.category_search() })
      .subscribe(products => {
        this.products.set(products);
      });
  }

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
    this.products.update(products => products.map((product, index) => index === $index ? detail : product));
  }
}
