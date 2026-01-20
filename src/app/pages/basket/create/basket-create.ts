import {afterNextRender, Component, computed, inject, signal, ViewEncapsulation} from '@angular/core';
import {TuiBreadcrumbs, TuiCheckbox, TuiSwitch} from '@taiga-ui/kit';
import {TuiFormatNumberPipe, TuiLink} from '@taiga-ui/core';
import {TuiItem} from '@taiga-ui/cdk';
import {RouterLink} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {CartStore} from '@/cart';
import {IconComponent} from '@/components/icon/icon';
import {FormGroup, FormsModule} from '@angular/forms';
import {DeliveryPlace} from './delivery-place/delivery-place';
import {DeliveryTypeInputs} from '@/basket/create/delivery-type-inputs/delivery-type-inputs';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {ResponsiveBreakpointsService} from '@/services/responsive-breakpoints.service';
import {DialogService} from '@/services/dialog.service';
import {OrderService} from '@/services/order.service';
import {finalize} from 'rxjs';

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
  private readonly dialogs = inject(DialogService);
  private readonly orderService = inject(OrderService);
  private readonly rbs = inject(ResponsiveBreakpointsService);

  protected readonly carts = computed(() => this.cartStore.carts());

  protected readonly openDeliveryPlace = signal(false);
  protected readonly hideText = signal(false);
  protected readonly openMoreInfo = signal(false);
  protected readonly promoCodeSuccess = signal(false);
  protected readonly promoCodeLoading = signal(false);
  protected readonly promoCode = signal('');

  form = new FormGroup({

  })

  constructor() {
    afterNextRender(() => {
      setTimeout(() => document.getElementById('form').scrollIntoView({behavior: 'smooth'}), 1000);
    })
  }

  openModal() {
    if (this.rbs.isMobile()) {
      this.dialogs.open(
        new PolymorpheusComponent(DeliveryPlace),
      ).subscribe()
    } else {
      this.openDeliveryPlace.set(true)
    }
  }

  checkPromoCode() {
    this.promoCodeLoading.set(true);
    this.orderService
      .checkPromocode({promocode: this.promoCode()})
      .pipe(finalize(() => this.promoCodeLoading.set(false)))
      .subscribe(() => {
        this.promoCodeSuccess.set(true);
      })
  }
}
