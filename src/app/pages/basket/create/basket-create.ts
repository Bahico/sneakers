import {Component, computed, inject, signal, ViewEncapsulation} from '@angular/core';
import {TuiBreadcrumbs, TuiCheckbox, TuiSwitch} from '@taiga-ui/kit';
import {TuiFormatNumberPipe, TuiLink} from '@taiga-ui/core';
import {TuiItem} from '@taiga-ui/cdk';
import {RouterLink} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {CartStore} from '@/cart';
import {IconComponent} from '@/components/icon/icon';
import {FormsModule} from '@angular/forms';
import {DeliveryPlace} from './delivery-place/delivery-place';
import {DeliveryTypeInputs} from '@/basket/create/delivery-type-inputs/delivery-type-inputs';

@Component({
  templateUrl: 'basket-create.html',
  selector: 'basket-create',
  styleUrl: 'basket-create.css',
  encapsulation: ViewEncapsulation.None,
  host: {class: 'flex w-full justify-center'},
  imports: [
    TuiBreadcrumbs,
    TuiLink,
    TuiItem,
    RouterLink,
    AsyncPipe,
    TuiFormatNumberPipe,
    IconComponent,
    FormsModule,
    TuiCheckbox,
    TuiSwitch,
    DeliveryPlace,
    DeliveryTypeInputs
  ],
})
export default class BasketCreate {
  private readonly cartStore = inject(CartStore);

  protected readonly carts = computed(() => this.cartStore.carts());

  protected readonly openDeliveryPlace = signal(false);
}
