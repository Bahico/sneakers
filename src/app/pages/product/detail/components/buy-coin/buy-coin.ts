import {Component} from '@angular/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import {TuiDialogContext} from '@taiga-ui/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  templateUrl: 'buy-coin.html',
  selector: 'buy-coin',
  styleUrl: 'buy-coin.css',
  imports: [
    NgOptimizedImage
  ]
})
export class BuyCoin {
  protected readonly context = injectContext<TuiDialogContext<string, string>>();

  close() {
    this.context.$implicit.complete();
  }
}
