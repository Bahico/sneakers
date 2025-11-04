import {afterNextRender, Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import Navbar from './layout/navbar/navbar';
import Footer from './layout/footer/footer';
import {TuiRoot} from '@taiga-ui/core';
import {CartService} from '@/services/cart.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, TuiRoot],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly cartService = inject(CartService);

  constructor() {
    afterNextRender(() => {
      this.cartService.loadCart();
    })
  }
}
