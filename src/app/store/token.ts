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
      this.cookieService.delete(this.refreshCol);
    }
    this.cookieService.set(this.accessCol, value.access, null, '/');
    this.cookieService.set(this.refreshCol, value.refresh, null, '/');
    this.token$.set(value);
  }

  get token() {
    if (
      !this.token$() &&
      this.cookieService.get(this.accessCol) &&
      this.cookieService.get(this.refreshCol)
    ) {
      this.token$.set({
        access: this.cookieService.get(this.accessCol),
        refresh: this.cookieService.get(this.refreshCol)
      })
    }
    return this.token$.asReadonly();
  }
}
