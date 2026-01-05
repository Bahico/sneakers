import {Component, inject} from '@angular/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import {TuiDialogContext} from '@taiga-ui/core';
import {AuthenticationOpen} from '@/components/authentication/authentication-open';
import {NgOptimizedImage} from '@angular/common';
import {CartService} from '@/services/cart.service';

@Component({
  templateUrl: 'buy-coin.html',
  styleUrls: ['buy-coin.css'],
  selector: 'buy-coin',
  imports: [
    NgOptimizedImage
  ]
})
export class BuyCoin {
  private readonly authenticationOpen = inject(AuthenticationOpen);
  private readonly cartService = inject(CartService);
  protected readonly context = injectContext<TuiDialogContext<string, string>>();

  close() {
    this.context.$implicit.complete();
  }

  openAuthentication() {
    this.authenticationOpen.openModal();
    this.close();
  }

  getCart(): void {
    this.cartService.setCartId(crypto.randomUUID());
    this.cartService.loadCart().subscribe(() => this.close());
  }
}
