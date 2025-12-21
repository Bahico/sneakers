import {inject, Injectable, signal} from '@angular/core';
import {Account} from '@/models/account';
import {HttpClient} from '@angular/common/http';
import {getEndpoint} from '@/get-endpoint';
import {tap} from 'rxjs';
import {TokenStore} from '@/token';
import {CartStore} from '@/cart';

@Injectable({providedIn: 'root'})
export class AccountStore {
  private readonly http = inject(HttpClient);
  private readonly tokenStore = inject(TokenStore);
  private readonly cartStore = inject(CartStore);

  private readonly account$ = signal<Account>(null);

  set update(value: Account) {
    this.account$.set(value);
  }

  get account() {
    return this.account$.asReadonly();
  }

  getAccount() {
    return this.http.get<Account>(getEndpoint('auth/me'))
      .pipe(tap(value => this.update = value))
  }

  logout() {
    this.update = null;
    this.tokenStore.update = null;
    this.cartStore.update = {};
  }
}
