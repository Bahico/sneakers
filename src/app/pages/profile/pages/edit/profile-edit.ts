import {afterNextRender, Component, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TuiBreadcrumbs, TuiCheckbox} from '@taiga-ui/kit';
import {TuiFlagPipe, TuiLink} from '@taiga-ui/core';
import {TuiDay, TuiItem} from '@taiga-ui/cdk';
import {ProfileMenu} from '@/profile/components/menu/profile-menu';
import {IconComponent} from '@/components/icon/icon';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '@/services/auth.service';
import {AccountStore} from '@/account';
import {catchError, forkJoin, of} from 'rxjs';
import {PassportData, UpdateUserProfileDto} from '@/models/passport';
import {DateComponent} from '@/components/date/date';
import {NgxMaskDirective} from 'ngx-mask';

@Component({
  templateUrl: 'profile-edit.html',
  selector: 'profile-edit',
  host: {class: 'flex w-full justify-center pb-10'},
  imports: [
    RouterLink,
    TuiBreadcrumbs,
    TuiLink,
    TuiItem,
    ProfileMenu,
    IconComponent,
    TuiCheckbox,
    FormsModule,
    ReactiveFormsModule,
    DateComponent,
    TuiFlagPipe,
    NgxMaskDirective
  ]
})
export default class ProfileEdit {
  private readonly authService = inject(AuthService);
  private readonly accountStore = inject(AccountStore);

  checked = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);
  hasPassportData = signal(false);

  readonly maxDate = signal<TuiDay | null>(null);

  profileForm = new FormGroup({
    email: new FormControl<string | null>(null),
    phone: new FormControl<string | null>(null)
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
      this.loadUserData();
      this.loadPassportData();
      this.loadMaxDate();
    })
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
          }
        });
    }
  }

  loadPassportData() {
    this.authService.getPassportData()
      .pipe(
        catchError(() => of(null))
      )
      .subscribe(data => {
        if (data) {
          this.hasPassportData.set(true);
          this.passportForm.patchValue(data);
          if (!data.surname) {
            this.checked.set(true);
          }
        }
      });
  }

  onSurnameCheckboxChange(checked: boolean) {
    this.checked.set(checked);
    if (checked) {
      this.passportForm.patchValue({f_name: null});
    }
  }

  onSave() {
    if (this.profileForm.invalid || this.passportForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.passportForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);

    const profileData: Partial<UpdateUserProfileDto> = {
      // email: this.profileForm.value.email || undefined,
      phone: this.profileForm.value.phone || undefined,
      first_name: this.passportForm.value.name || undefined,
      last_name: this.passportForm.value.surname || undefined,
      // telegram_id: this.profileForm.value.telegram_id || undefined
    };

    const passportData = <PassportData>this.passportForm.getRawValue();

    const profileUpdate$ = this.authService.updateUserProfile(profileData);
    const passportUpdate$ = this.hasPassportData()
      ? this.authService.updatePassportData(passportData)
      : this.authService.createPassportData(passportData);

    forkJoin({
      profile: profileUpdate$,
      passport: passportUpdate$
    })
      .pipe(
        catchError(error => {
          this.error.set(error?.error?.message || 'Ошибка при сохранении данных');
          return of(null);
        })
      )
      .subscribe(result => {
        this.loading.set(false);
        if (result) {
          this.success.set(true);
          if (!this.hasPassportData()) {
            this.hasPassportData.set(true);
          }
        }
      });
  }
}
