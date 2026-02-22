import {inject, Injectable, signal} from '@angular/core';
import {TokenModel} from '@/models/token.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({providedIn: 'root'})
export class TokenStore {
  private readonly cookieService = inject(CookieService);

  private readonly token$ = signal<TokenModel>(null);

  private readonly accessCol = 'sn_access';
  private readonly refreshCol = 'sn_refresh';

  set update(value: TokenModel | null) {
    if (!value) {
      this.cookieService.delete(this.accessCol);
      this.cookieService.delete(this.refreshCol, '/', location.hostname);
      this.token$.set(null)
      return;
    }
    this.cookieService.set(this.accessCol, value.access_token, new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), '/');
    this.cookieService.set(this.refreshCol, value.refresh_token, new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), '/');
    this.token$.set(value);
  }

  get token() {
    if (
      !this.token$() &&
      this.cookieService.get(this.accessCol) &&
      this.cookieService.get(this.refreshCol)
    ) {
      this.token$.set({
        access_token: this.cookieService.get(this.accessCol),
        refresh_token: this.cookieService.get(this.refreshCol)
      })
    }
    return this.token$.asReadonly();
  }
}
