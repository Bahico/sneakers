import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { CartService } from '@/services/cart.service';
import { AccountStore } from '@/account';
import { TokenStore } from '@/token';
import { FavoritesService } from '@/services/favorites.service';
import {concatMap, forkJoin, mergeMap, of} from 'rxjs';

export const appInitResolver: ResolveFn<boolean> = () => {
  const cartService = inject(CartService);
  const accountStore = inject(AccountStore);
  const tokenStore = inject(TokenStore);
  const favoritesService = inject(FavoritesService);

  if (tokenStore.token()?.access_token) {
    return accountStore.getAccount()
      .pipe(
        mergeMap(() => forkJoin([
          cartService.loadCart(),
          favoritesService.get({ page: 1, limit: 1 })
        ])),
        concatMap(() => of(true))
      );
  }

  return of(true);
};
