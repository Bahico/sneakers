import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint} from '@/get-endpoint';
import {ProductListDetailModel, ProductListModel, ProductModel} from '@/models/product.model';
import {ListResult} from '@/models/list-result';
import {tap} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ProductService {
  private readonly http = inject(HttpClient);

  private readonly products$ = signal<ProductListDetailModel[]>([])
  readonly products = this.products$.asReadonly();

  detail(id: string) {
    return this.http.get<ProductModel>(getEndpoint(`products/id/${id}`));
  }

  query(params: any) {
    return this.http.get<ProductListModel>(getEndpoint('products/'), {params})
    // return this.http.get<ProductListModel>('faker/products.json', {params})
      .pipe(tap(res => this.products$.set(res.products)));
  }

  withCategory(params: {category1?: string, category2?: string; category3?: string}) {
    return this.http.get<ListResult<ProductListDetailModel>>(getEndpoint('products_actual/'), {params});
  }
}
