import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint} from '@/get-endpoint';
import {ProductListDetail, ProductModel} from '@/models/product.model';
import {ListResult} from '@/models/list-result';

@Injectable({providedIn: 'root'})
export class ProductService {
  private readonly http = inject(HttpClient);

  detail(spuId: number) {
    return this.http.get<ProductModel>(getEndpoint(`products/${spuId}`));
  }

  query(params: any) {
    return this.http.get<ListResult<ProductListDetail>>(getEndpoint('products/'), {params});
  }
}
