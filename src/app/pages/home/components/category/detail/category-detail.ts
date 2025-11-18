import {Component, inject} from '@angular/core';
import {ProductService} from '@/services/product.service';
import {ProductListDetail} from '@/components/product-list-detail/product-list-detail';


@Component({
  templateUrl: 'category-detail.html',
  selector: 'category-detail',
  imports: [
    ProductListDetail
  ]
})
export class CategoryDetail {
  private readonly productService = inject(ProductService);

  products = this.productService.products;
}
