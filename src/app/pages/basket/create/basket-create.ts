import {afterNextRender, Component, effect, inject, signal, ViewEncapsulation} from '@angular/core';
import {TuiBreadcrumbs, TuiCheckbox, TuiSwitch} from '@taiga-ui/kit';
import {TuiFlagPipe, TuiFormatNumberPipe, TuiLink} from '@taiga-ui/core';
import {TuiDay, TuiItem} from '@taiga-ui/cdk';
import {Router, RouterLink} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {CartStore} from '@/cart';
import {IconComponent} from '@/components/icon/icon';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {DeliveryPlace} from './delivery-place/delivery-place';
import {DeliveryTypeInputs} from '@/basket/create/delivery-type-inputs/delivery-type-inputs';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {ResponsiveBreakpointsService} from '@/services/responsive-breakpoints.service';
import {DialogService} from '@/services/dialog.service';
import {OrderService} from '@/services/order.service';
import {catchError, concatMap, finalize, forkJoin, Observable, of, tap} from 'rxjs';
import {PaymentForm, PaymentModel} from '@/models/basket';
import {DeliveryType} from '@/models/order';
import {DateComponent} from '@/components/date/date';
import {NgxMaskDirective} from 'ngx-mask';
import {AuthService} from '@/services/auth.service';
import {AccountStore} from '@/account';
import {PassportData} from '@/models/passport';

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
  private readonly dialogs = inject(DialogService);
  private readonly orderService = inject(OrderService);
  private readonly authService = inject(AuthService);
  private readonly accountStore = inject(AccountStore);
  private readonly router = inject(Router);


  protected readonly carts = this.cartStore.carts;
  protected readonly coins = this.authService.coins;

  protected readonly openDeliveryPlace = signal(false);
  protected readonly hideText = signal(false);
  protected readonly openMoreInfo = signal(false);
  protected readonly checked = signal(false);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly hasPassportData = signal(false);
  protected readonly promoCodeSuccess = signal(false);
  protected readonly promoCodeLoading = signal(false);
  protected readonly promoCode = signal('');
  protected readonly maxDate = signal<TuiDay | null>(null);

  protected readonly passportChanged = signal(false);
  protected readonly profileChanged = signal(false);

  form = new FormGroup<PaymentForm>({
    delivery_type: new FormControl<DeliveryType>('cdek_pickup'),
    delivery_data: new FormControl(null),
    use_split_payment: new FormControl(false),
    referral_code: new FormControl(null),
    use_sneaker_coins: new FormControl(false),
    customer_comment: new FormControl(null),
  });

  profileForm = new FormGroup({
    email: new FormControl<string | null>(null, Validators.required),
    phone: new FormControl<string | null>(null, Validators.required),
    first_name: new FormControl<string | null>(null),
    last_name: new FormControl(null),
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

  constructor() {
    afterNextRender(() => {
      setTimeout(() => document.getElementById('form').scrollIntoView({behavior: 'smooth'}), 1000);
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
    } else {
      this.accountStore.getAccount()
        .pipe(catchError(() => of(null)))
        .subscribe(account => {
          if (account) {
            this.profileForm.patchValue(account);

            this.subscribeProfileChanges()
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
      .checkPromocode({promocode: this.promoCode()})
      .pipe(finalize(() => this.promoCodeLoading.set(false)))
      .subscribe(() => {
        this.promoCodeSuccess.set(true);
      })
  }

  onSurnameCheckboxChange(checked: boolean) {
    this.checked.set(checked);
    if (checked) {
      this.passportForm.patchValue({f_name: null});
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data = this.onSaveData();
    if (data) {
      data
        .pipe(concatMap(() => this.orderService.payment(this.paymentRowValue)))
        .subscribe(res => {
          if (res?.success) {
            this.openPaymentModal(res.payment.payment_url);
          }
        })
    }
  }

  openPaymentModal(payment_url: string) {
    const width = 600;
    const height = 600;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;

    const features = 'width=700' + ', height=800' +
      ', top=' + top + ', left=' + left +
      ', resizable=yes, scrollbars=yes, status=no, menubar=no, toolbar=no';
    const newWindow = window.open(payment_url, 'payment', features);

    if (newWindow) {
      newWindow.focus();
      const polling = setInterval(() => {
        if (newWindow.closed) {
          clearInterval(polling);
          this.router.navigate(['/profile', 'orders']);
        }
      }, 500);

    }
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
    };

    const passportData = <PassportData>this.passportForm.getRawValue();

    const profileUpdate$ = this.authService.updateUserProfile(profileData);
    const passportUpdate$ = this.hasPassportData()
      ? this.authService.updatePassportData(passportData)
      : this.authService.createPassportData(passportData);

      console.log(this.profileChanged(), this.passportChanged());
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
            if (!this.hasPassportData()) {
              this.hasPassportData.set(true);
            }
          }
        })
      )
  }
}
