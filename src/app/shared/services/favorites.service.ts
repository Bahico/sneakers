import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint} from '@/get-endpoint';
import {Favorite} from '@/models/favorite';
import { map, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class FavoritesService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = getEndpoint('favorites');

  private readonly total$ = signal<number>(0);
  total = this.total$.asReadonly();

  get(params: {page: number; limit: number}) {
    return this.http.get<{total: number; items: Favorite[]}>(this.endpoint + '/', {params})
    .pipe(tap(res => this.total$.set(res.total)), map(res => res.items));
  }

  add(product_id: string) {
    return this.http.post(`${this.endpoint}/add`, {product_id});
  }

  delete(product_id: string) {
    return this.http.delete(`${this.endpoint}/${product_id}`);
  }

  /**
   * Check if a product is in the favorites
   * @param product_id - The product ID
   * @returns Observable of {is_favorite: boolean}
   */
  check(product_id: string) {
    return this.http.get<{is_favorite: boolean}>(`${this.endpoint}/${product_id}/check`);
  }
}
