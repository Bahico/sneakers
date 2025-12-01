import {Component, inject} from '@angular/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import {TuiDialogContext} from '@taiga-ui/core';
import {NgOptimizedImage} from '@angular/common';
import {AuthenticationOpen} from '@/components/authentication/authentication-open';

@Component({
  templateUrl: 'buy-coin.html',
  selector: 'buy-coin',
  styleUrl: 'buy-coin.css',
  imports: [
    NgOptimizedImage
  ]
})
export class BuyCoin {
  private readonly authenticationOpen = inject(AuthenticationOpen);
  protected readonly context = injectContext<TuiDialogContext<string, string>>();

  close() {
    this.context.$implicit.complete();
  }

  openAuthentication() {
    this.authenticationOpen.openModal();
    this.close();
  }
}
