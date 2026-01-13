import {afterNextRender, Component, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TuiBreadcrumbs} from '@taiga-ui/kit';
import {TuiLink} from '@taiga-ui/core';
import {TuiItem} from '@taiga-ui/cdk';
import {FavoritesService} from '@/services/favorites.service';
import {ProductListDetail} from '@/components/product-list-detail/product-list-detail';
import {Favorite} from '@/models/favorite';
import {ProductListDetailModel} from '@/models/product.model';
import {InfiniteScrollDirective} from 'ngx-infinite-scroll';

@Component({
  templateUrl: 'favorites.html',
  selector: 'favorites',
  imports: [
    RouterLink,
    TuiBreadcrumbs,
    TuiLink,
    TuiItem,
    ProductListDetail,
    InfiniteScrollDirective
  ],
  host: {class: 'flex w-full justify-center'},
})
export default class Favorites {
  private readonly favoritesService = inject(FavoritesService);

  favorites = signal<Favorite[]>([]);
  private readonly page = signal(0);

  protected readonly throttle = 10;
  protected readonly scrollDistance = 2;

  constructor() {
    afterNextRender(() => {
      this.loadFavorites();
    });
  }

  loadFavorites() {
    this.page.update(page => page + 1);
    this.favoritesService.get({page: this.page(), limit: 20}).subscribe({
      next: (response) => {
        const products = response.items;
        this.favorites.update(currentProducts => [
          ...currentProducts,
          ...(Array.isArray(products) ? products : []).map(product => ({...product, product: {...product.product, is_favorite: true}})),
        ]);
      },
      error: (error) => {
        this.favorites.set([]);
      }
    });
  }

  productChanged(product: ProductListDetailModel, index: number) {
    const currentFavorites = this.favorites();

    currentFavorites[index] = {
      ...currentFavorites[index],
      product: product
    }

    this.favorites.set(currentFavorites);
  }
}
