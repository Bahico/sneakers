import {Component, computed, inject} from '@angular/core';
import {ProductDetailStore} from '@/product/detail/services/product-detail-store';
import {AsyncPipe} from '@angular/common';
import {TuiDialogService, TuiFormatNumberPipe} from '@taiga-ui/core';
import {Feedback} from '@/product/detail/components/feedback/feedback';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {BuyCoin} from '@/product/detail/components/buy-coin/buy-coin';
import {AccountStore} from '@/account';
import {AuthenticationOpen} from '@/components/authentication/authentication-open';

@Component({
  templateUrl: 'product-detail-name.html',
  imports: [
    AsyncPipe,
    TuiFormatNumberPipe
  ],
  selector: 'product-detail-name'
})
export class ProductDetailName {
  private readonly accountStore = inject(AccountStore);
  private readonly productDetailStore = inject(ProductDetailStore);
  private readonly dialogs = inject(TuiDialogService);
  private readonly authenticationService = inject(AuthenticationOpen);


  protected readonly detail = this.productDetailStore.detail;

  openFeedback() {
    if (this.accountStore.account()) {
      this.dialogs
        .open(
          new PolymorpheusComponent(Feedback),
          {
            label: null,
            size: 'l'
          },
        )
        .subscribe();
    } else {
      this.authenticationService.openModal();
    }
  }

  openCoin() {
    this.dialogs
      .open(
        new PolymorpheusComponent(BuyCoin),
        {
          label: null,
          size: 'l'
        },
      )
      .subscribe();
  }
}
