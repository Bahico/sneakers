import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint} from '../../config/get-endpoint';
import {ProductModel} from '@/models/product.model';

@Injectable({providedIn: 'root'})
export class ProductService {
  private readonly http = inject(HttpClient);

  detail(spuId: number) {
    return this.http.get<ProductModel>(getEndpoint(`products/${spuId}`));
  }
}
