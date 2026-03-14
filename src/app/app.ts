import {afterNextRender, Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import Navbar from './layout/navbar/navbar';
import Footer from './layout/footer/footer';
import {TuiRoot} from '@taiga-ui/core';
import {CartService} from '@/services/cart.service';
import {AccountStore} from '@/account';
import {forkJoin, mergeMap} from 'rxjs';
import {TokenStore} from '@/token';
import {FavoritesService} from '@/services/favorites.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, TuiRoot],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  encapsulation: ViewEncapsulation.None
})
export class App {
  private readonly cartService = inject(CartService);
  private readonly accountStore = inject(AccountStore);
  private readonly tokenStore = inject(TokenStore);
  private readonly favoritesService = inject(FavoritesService);

  constructor() {
    afterNextRender(() => {
      if (this.tokenStore.token()?.access_token){
        forkJoin([
          this.accountStore.getAccount(),
          this.favoritesService.get({page: 1, limit: 1})
        ])
        .pipe(
          mergeMap(() => this.cartService.loadCart())
        )
        .subscribe()
      }

      if (this.cartService.getCartId() && !this.tokenStore.token()?.access_token) {
        this.cartService.loadCart().subscribe();
      }
    })
  }
}
