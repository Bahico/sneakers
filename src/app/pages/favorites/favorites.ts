import {afterNextRender, Component, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TuiBreadcrumbs} from '@taiga-ui/kit';
import {TuiLink} from '@taiga-ui/core';
import {TuiItem} from '@taiga-ui/cdk';
import {FavoritesService} from '@/services/favorites.service';
import {ProductListDetail} from '@/components/product-list-detail/product-list-detail';
import {Favorite} from '@/models/favorite';

@Component({
  templateUrl: 'favorites.html',
  selector: 'favorites',
  imports: [
    RouterLink,
    TuiBreadcrumbs,
    TuiLink,
    TuiItem,
    ProductListDetail
  ],
  host: {class: 'flex w-full justify-center'},
})
export default class Favorites {
  private readonly favoritesService = inject(FavoritesService);

  favorites = signal<Favorite[]>([]);

  constructor() {
    afterNextRender(() => {
      this.loadFavorites();
    });
  }

  private loadFavorites() {
    this.favoritesService.get({page: 1, limit: 100}).subscribe({
      next: (response) => {
        const products = response.items;
        this.favorites.set(Array.isArray(products) ? products : []);
      },
      error: (error) => {
        console.error('Error loading favorites:', error);
        this.favorites.set([]);
      }
    });
  }
}
