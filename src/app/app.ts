import {afterNextRender, Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import Navbar from './layout/navbar/navbar';
import Footer from './layout/footer/footer';
import {TuiRoot} from '@taiga-ui/core';
import {CartService} from '@/services/cart.service';
import {AccountStore} from '@/account';
import {mergeMap} from 'rxjs';
import {FavoriteService} from '@/services/favorite.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, TuiRoot],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly cartService = inject(CartService);
  private readonly accountStore = inject(AccountStore);
  private readonly favoritesService = inject(FavoriteService);

  constructor() {
    afterNextRender(() => {
      this.accountStore.getAccount()
        .pipe(
          mergeMap(() => this.cartService.loadCart()),
          mergeMap(() => this.favoritesService.loadFavorites()))
        .subscribe();
    })
  }
}
