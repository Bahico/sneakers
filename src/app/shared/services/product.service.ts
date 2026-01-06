import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint} from '@/get-endpoint';
import {ProductListDetailModel, ProductListModel, ProductModel} from '@/models/product.model';
import {ListResult} from '@/models/list-result';
import {tap} from 'rxjs';
import {Brand} from '@/models/brand';
import {SizeTable} from '@/models/size-table.model';

@Injectable({providedIn: 'root'})
export class ProductService {
  private readonly http = inject(HttpClient);

  private readonly products$ = signal<ProductListDetailModel[]>([])
  readonly products = this.products$.asReadonly();

  setProducts(products: ProductListDetailModel[]) {
    this.products$.set(products);
  }

  detail(id: string) {
    return this.http.get<ProductModel>(getEndpoint(`products/id/${id}`));
  }

  query(params: any) {
    return this.http.get<ProductListModel>(getEndpoint('products'), {params})
      .pipe(tap(res => this.setProducts(res.products)));
  }

  brands(query: {limit: number; category_slug: string}) {
    return this.http.get<Brand[]>(getEndpoint('brands'), {params: query});
  }

  sizes(query: {category_slug: string; brand_id?: string}) {
    return this.http.get<{size_table: SizeTable[]}>(getEndpoint('products/filters/sizes'), {params: query});
  }
}
