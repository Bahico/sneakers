import {Component, inject} from '@angular/core';
import {ProductDetailStore} from '@/product/detail/services/product-detail-store';
import {AsyncPipe} from '@angular/common';
import {TuiDialogService, TuiFormatNumberPipe} from '@taiga-ui/core';
import {Feedback} from '@/product/detail/components/feedback/feedback';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';

@Component({
  templateUrl: 'product-detail-name.html',
  imports: [
    AsyncPipe,
    TuiFormatNumberPipe
  ],
  selector: 'product-detail-name'
})
export class ProductDetailName {
  private readonly productDetailStore = inject(ProductDetailStore);
  private readonly dialogs = inject(TuiDialogService);

  protected readonly detail = this.productDetailStore.detail;

  openFeedback() {
    this.dialogs
      .open(
        new PolymorpheusComponent(Feedback),
        {
          label: null,
          size: 'l'
        },
      )
      .subscribe();
  }
}
