import {Component} from '@angular/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import {TuiDialogContext, TuiFormatNumberPipe} from '@taiga-ui/core';
import {AsyncPipe, NgOptimizedImage} from '@angular/common';
import {IconComponent} from '@/components/icon/icon';

@Component({
  templateUrl: 'gift-order.html',
  selector: 'gift-order',
  imports: [
    TuiFormatNumberPipe,
    AsyncPipe,
    IconComponent,
    NgOptimizedImage
  ]
})
export class GiftOrder {
  protected readonly context = injectContext<TuiDialogContext<string, number>>();

  close() {
    this.context.$implicit.complete()
  }
}
