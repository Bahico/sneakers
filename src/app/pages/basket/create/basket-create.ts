import { afterNextRender, Component, computed, effect, inject, signal, ViewEncapsulation } from '@angular/core';
import { TuiBreadcrumbs, TuiCheckbox, TuiSwitch } from '@taiga-ui/kit';
import { TuiFlagPipe, TuiFormatNumberPipe, TuiLink } from '@taiga-ui/core';
import { TuiDay, TuiItem } from '@taiga-ui/cdk';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { CartStore } from '@/cart';
import { IconComponent } from '@/components/icon/icon';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DeliveryPlace } from './delivery-place/delivery-place';
import { DeliveryTypeInputs } from '@/basket/create/delivery-type-inputs/delivery-type-inputs';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { ResponsiveBreakpointsService } from '@/services/responsive-breakpoints.service';
import { DialogService } from '@/services/dialog.service';
import { OrderService } from '@/services/order.service';
import { catchError, concatMap, finalize, forkJoin, Observable, of, tap } from 'rxjs';
import { PaymentForm, PaymentModel } from '@/models/basket';
import { DeliveryType } from '@/models/order';
import { DateComponent } from '@/components/date/date';
import { NgxMaskDirective } from 'ngx-mask';
import { AuthService } from '@/services/auth.service';
import { AccountStore } from '@/account';
import { PassportData } from '@/models/passport';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartService } from '@/services/cart.service';

@Component({
  templateUrl: 'basket-create.html',
  selector: 'basket-create',
  styleUrl: 'basket-create.css',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'flex w-full justify-center' },
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
    DeliveryTypeInputs,
    DateComponent,
    NgxMaskDirective,
    ReactiveFormsModule,
    TuiFlagPipe
  ],
})
export default class BasketCreate {
  private readonly rbs = inject(ResponsiveBreakpointsService);
  private readonly cartStore = inject(CartStore);
  private readonly cartService = inject(CartService);
  private readonly dialogs = inject(DialogService);
  private readonly orderService = inject(OrderService);
  private readonly authService = inject(AuthService);
  private readonly accountStore = inject(AccountStore);
  private readonly router = inject(Router);


  protected readonly carts = this.cartStore.carts;
  protected readonly coins = this.authService.coins;

  protected readonly openDeliveryPlace = signal(false);
  protected readonly hideText = signal(false);
  protected readonly enterEmptyFields = signal(false);
  protected readonly openMoreInfo = signal(false);
  protected readonly checked = signal(false);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly hasPassportData = signal(false);
  protected readonly promoCodeSuccess = signal(false);
  protected readonly promoCodeError = signal(false);
  protected readonly promoCodeLoading = signal(false);
  protected readonly promoCode = signal('');
  protected readonly promoCodeData = signal<{ discount: number; discount_type: 'percent' | 'fixed' } | null>(null);
  protected readonly maxDate = signal<TuiDay | null>(null);

  protected readonly passportChanged = signal(false);
  protected readonly profileChanged = signal(false);

  form = new FormGroup<PaymentForm>({
    delivery_type: new FormControl<DeliveryType>('cdek_pickup'),
    delivery_data: new FormControl(null, Validators.required),
    use_split_payment: new FormControl(false),
    referral_code: new FormControl(null),
    use_sneaker_coins: new FormControl(false),
    customer_comment: new FormControl(null),
  });

  profileForm = new FormGroup({
    email: new FormControl<string | null>(null, Validators.required),
    phone: new FormControl<string | null>(null, Validators.required)
  });

  passportForm = new FormGroup({
    id: new FormControl(null),
    name: new FormControl<string | null>(null, Validators.required),
    surname: new FormControl<string | null>(null, Validators.required),
    f_name: new FormControl<string | null>(null),
    passport_number: new FormControl<string | null>(null),
    passport_series: new FormControl<string | null>(null),
    inn: new FormControl<string | null>(null, Validators.required),
    date_of_give: new FormControl<string | null>(null, Validators.required),
  });

  protected readonly useSneakerCoins = toSignal(this.form.controls.use_sneaker_coins.valueChanges);
  protected readonly totalSum = computed(() => {
    let total = this.carts().total_price;
    if (this.useSneakerCoins()) {
      if (total < this.coins().sneaker_coins) {
        total = 100;
      } else {
        total = total - this.coins().sneaker_coins;
      }
    }
    if (this.promoCodeData()) {
      switch (this.promoCodeData().discount_type) {
        case 'percent':
          const percent = total / 100;
          total = total - (percent * this.promoCodeData().discount);
          break;
        case 'fixed':
          total = total - this.promoCodeData().discount;
          break;
      }
    }
    return total;
  });
  protected readonly sneaker_coins = computed(() => {
    if (this.carts().total_price < this.coins().sneaker_coins) {
      return this.carts().total_price - 100;
    } else {
      return this.coins().sneaker_coins;
    }
  })

  constructor() {
    afterNextRender(() => {
      setTimeout(() => document.getElementById('form').scrollIntoView({ behavior: 'smooth' }), 1000);
      this.loadMaxDate();
      this.loadUserData();
      this.loadPassportData();
      this.authService.getCoins();
    });

    effect(() => {
      if (!this.coins()?.sneaker_coins) {
        this.form.controls.use_sneaker_coins.setValue(false);
        this.form.controls.use_sneaker_coins.disable();
      } else {
        this.form.controls.use_sneaker_coins.enable();
      }
    });

    effect(() => {
      if (this.carts()?.total_price > 20000) {
        this.form.controls.use_split_payment.setValue(false);
        this.form.controls.use_split_payment.disable();
      } else {
        this.form.controls.use_split_payment.enable();
      }
    });
  }

  loadMaxDate() {
    const date = new Date();
    this.maxDate.set(new TuiDay(date.getFullYear(), date.getMonth(), date.getDate()));
  }

  loadUserData() {
    const account = this.accountStore.account();
    if (account) {
      this.profileForm.patchValue(account);
      this.subscribeProfileChanges();
    } else {
      this.accountStore.getAccount()
        .pipe(catchError(() => of(null)))
        .subscribe(account => {
          if (account) {
            this.profileForm.patchValue(account);

            this.subscribeProfileChanges();
          }
        });
    }
  }

  subscribeProfileChanges() {
    this.profileForm.valueChanges.subscribe(() => this.profileChanged.set(true));
  }

  loadPassportData() {
    this.authService.getPassportData()
      .pipe(
        catchError(() => of(null))
      )
      .subscribe({
        next: data => {
          if (data) {
            this.hasPassportData.set(true);
            this.passportForm.patchValue(data);
            if (!data.f_name) {
              this.checked.set(true);
            }

          }
          this.subscribePassportChanges();
        }
      });
  }

  subscribePassportChanges() {
    this.passportForm.valueChanges.subscribe(() => this.passportChanged.set(true));
  }

  openModal() {
    if (this.rbs.isMobile()) {
      this.dialogs.open(
        new PolymorpheusComponent(DeliveryPlace),
        {
          data: this.form
        }
      ).subscribe()
    } else {
      this.openDeliveryPlace.set(true)
    }
  }

  checkPromoCode() {
    this.promoCodeLoading.set(true);
    this.orderService
      .checkPromocode({ promocode: this.promoCode() })
      .pipe(finalize(() => this.promoCodeLoading.set(false)))
      .subscribe({
        next: res => {
          this.promoCodeSuccess.set(true);
          this.promoCodeData.set({ discount: res.message.discount_value, discount_type: res.message.promo_type });
        },
        error: () => {
          this.promoCodeError.set(true);
        }
      })
  }

  onSurnameCheckboxChange(checked: boolean) {
    this.checked.set(checked);
    if (checked) {
      this.passportForm.patchValue({ f_name: null });
    }
  }

  onSubmit() {
    if (this.form.invalid || this.profileForm.invalid || this.passportForm.invalid) {
      this.form.markAllAsTouched();
      this.enterEmptyFields.set(true);
      return;
    }

    const data = this.onSaveData();
    if (data) {
      data
        .pipe(concatMap(() => this.orderService.payment(this.paymentRowValue)))
        .subscribe(res => {
          if (res?.success) {
            this.openPaymentTab(res.payment.payment_url, res.order_number);
          }
        })
    }
  }

  openPaymentTab(payment_url: string, order_number: string) {
    window.open(payment_url, '_blank');
    this.connectPaymentWs(order_number);
  }

  connectPaymentWs(order_number: string) {
    const ws = new WebSocket(`wss://api.sneakerteam.ru/api/v1/orders/payment/ws/${order_number}`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.status === 'success') {
          ws.close();
          this.cartService.loadCart(true);
          this.authService.getCoins(true);
          this.router.navigate(['/basket', 'success']);
        }
      } catch {}
    };

    ws.onerror = () => ws.close();
  }

  get paymentRowValue(): PaymentModel {
    const profile = this.profileForm.getRawValue();
    const passport = this.passportForm.getRawValue();
    const form = this.form.getRawValue();
    return {
      delivery_data: form.delivery_data,
      delivery_type: form.delivery_type,
      promocode: this.promoCodeSuccess() ? this.promoCode() : null,
      referral_code: form.referral_code,
      use_split_payment: form.use_split_payment,
      use_sneaker_coins: form.use_sneaker_coins,
      customer_comment: form.customer_comment,
      customer_phone: profile.phone,
      customer_email: profile.email,
      customer_first_name: passport.name,
      customer_last_name: passport.surname,
      customer_middle_name: passport.f_name,
      customer_no_middle_name: !passport.f_name,
      customer_passport_series: passport.passport_series,
      customer_passport_number: passport.passport_number,
      customer_inn: passport.inn,
      customer_passport_issue_date: passport.date_of_give,
    };
  }

  onSaveData(): Observable<any> | null {
    if (this.profileForm.invalid || this.passportForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.passportForm.markAllAsTouched();
      return void (0);
    }

    this.loading.set(true);
    this.error.set(null);

    const profileData = {
      email: this.profileForm.value.email || undefined,
      phone: this.profileForm.value.phone || undefined,
      first_name: this.passportForm.value.name || undefined,
      last_name: this.passportForm.value.surname || undefined,
    };

    const passportData = <PassportData>this.passportForm.getRawValue();

    const profileUpdate$ = this.authService.updateUserProfile(profileData);
    const passportUpdate$ = this.hasPassportData()
      ? this.authService.updatePassportData(passportData)
      : this.authService.createPassportData(passportData);

    return forkJoin({
      profile: this.profileChanged() ? profileUpdate$ : of(null),
      passport: this.passportChanged() ? passportUpdate$ : of(null)
    })
      .pipe(
        catchError(error => {
          this.error.set(error?.error?.message || 'Ошибка при сохранении данных');
          this.passportForm.markAllAsTouched();
          this.profileForm.markAllAsTouched();
          return of(null);
        }),
        tap(result => {
          this.loading.set(false);
          if (result) {
            this.accountStore.getAccount().subscribe();
            if (!this.hasPassportData()) {
              this.hasPassportData.set(true);
            }
          }
        })
      )
  }
}
