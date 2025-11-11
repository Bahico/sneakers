import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint} from '@/get-endpoint';
import {tap} from 'rxjs';
import {FavoritesStore} from '@/favorites';

@Injectable({providedIn: 'root'})
export class FavoriteService {
  private readonly favoritesStore = inject(FavoritesStore);
  private readonly http = inject(HttpClient);

  private readonly endpoint = getEndpoint('favorites/');

  loadFavorites() {
    return this.favorites()
      .pipe(tap(res => {
        console.log(res)
      }));
  }

  favorites() {
    return this.http.get(this.endpoint);
  }

  add(sku_id: number) {
    return this.http.post(this.endpoint, {sku_id});
  }

  remove(sku_id: number) {
    return this.http.request('DELETE', `${this.endpoint}/remove/${sku_id}`, {body: {sku_id}});
  }
}
