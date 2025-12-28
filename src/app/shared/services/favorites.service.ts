import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint} from '@/get-endpoint';
import {Favorite} from '@/models/favorite';

@Injectable({providedIn: 'root'})
export class FavoritesService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = getEndpoint('favorites');

  get(params: {page: number; limit: number}) {
    return this.http.get<{total: number; items: Favorite[]}>(this.endpoint, {params});
  }

  add(product_id: string) {
    return this.http.post(`${this.endpoint}/add`, {product_id});
  }

  delete(product_id: string) {
    return this.http.delete(`${this.endpoint}/${product_id}`);
  }
}
