import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint} from '@/get-endpoint';
import {ProductListDetailModel, ProductModel} from '@/models/product.model';
import {ListResult} from '@/models/list-result';

@Injectable({providedIn: 'root'})
export class ProductService {
  private readonly http = inject(HttpClient);

  detail(spuId: number) {
    return this.http.get<ProductModel>(getEndpoint(`products/${spuId}`));
  }

  query(params: any) {
    // return this.http.get<ListResult<ProductListDetailModel>>(getEndpoint('products/'), {params});
    return this.http.get<ListResult<ProductListDetailModel>>('faker/products.json', {params});
  }

  similar(params: {category1: string, category2: string; category3: string}) {
    return this.http.get<ListResult<ProductListDetailModel>>(getEndpoint('products_actual/'), {params});
  }
}
