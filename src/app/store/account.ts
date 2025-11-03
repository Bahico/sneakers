import {inject, Injectable, signal} from '@angular/core';
import {Account} from '@/models/account';
import {HttpClient} from '@angular/common/http';
import {getEndpoint} from '@/get-endpoint';
import {tap} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AccountStore {
  private readonly http = inject(HttpClient);
  private readonly account$ = signal<Account>(null);

  set update(value: Account) {
    this.account$.set(value);
  }

  get account() {
    return this.account$.asReadonly();
  }

  getAccount() {
    return this.http.get<Account>(getEndpoint('auth/user/profile/'))
      .pipe(tap(value => this.update = value))
  }
}
