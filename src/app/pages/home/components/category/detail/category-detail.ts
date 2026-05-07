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
        this.products.set(products.map((product: any) => this.mapLastSoldProduct(product)));
      });
  }

  private mapLastSoldProduct(product: any): ProductListDetailModel {
    const size = product.size ?? {};

    return {
      id: product.product_id ?? product.id ?? product.product_article ?? product.order_number ?? '',
      slug: product.product_article ?? '',
      name: product.product_name ?? '',
      brand: { id: '', name: product.brand_name ?? '' } as any,
      availability: true,
      category: { id: '', full_slug: '', name: product.product_article ?? '' },
      fit: 'MALE',
      discount: false,
      returnable: true,
      large_sized: false,
      plashka: false,
      shoplaza: false,
      is_favorite: false,
      price: product.price_per_item ?? 0,
      article: product.product_article ?? '',
      split: product.price_per_item ? Math.round(product.price_per_item / 2) : 0,
      images: product.product_image_url ? [product.product_image_url] : [],
      main_variant: { size } as any,
      size_table: Object.keys(size).length ? [size] : [],
    } as ProductListDetailModel;
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
