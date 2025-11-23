import {Component, computed, inject, signal} from '@angular/core';
import {TuiBreadcrumbs, TuiCheckbox, TuiSegmented, TuiSwitch} from '@taiga-ui/kit';
import {TuiDialogService, TuiFormatNumberPipe, TuiLink} from '@taiga-ui/core';
import {TuiItem} from '@taiga-ui/cdk';
import {RouterLink} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {CartStore} from '@/cart';
import {IconComponent} from '@/components/icon/icon';
import {FormsModule} from '@angular/forms';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {DeliveryPlace} from '@/basket/create/delivery-place/delivery-place';

@Component({
  templateUrl: 'basket-create.html',
  selector: 'basket-create',
  host: {class: 'flex w-full justify-center'},
  imports: [
    TuiBreadcrumbs,
    TuiLink,
    TuiItem,
    RouterLink,
    AsyncPipe,
    TuiFormatNumberPipe,
    TuiSegmented,
    IconComponent,
    FormsModule,
    TuiCheckbox,
    TuiSwitch
  ],
  styles: [`
    .colors {

      &::before {
        color: #222;
        box-shadow: none;
      }

      .active {
        color: #fff;
      }
    }
  `]
})
export default class BasketCreate {
  private readonly dialogs = inject(TuiDialogService);
  private readonly cartStore = inject(CartStore);

  protected readonly carts = computed(() => this.cartStore.carts());

  protected readonly activeSegment = signal(0);

  openModal() {
    this.dialogs
      .open(
        new PolymorpheusComponent(DeliveryPlace),
        {
          label: null,
          size: 'l',
          closeable: false,
        }).subscribe()
  }
}
