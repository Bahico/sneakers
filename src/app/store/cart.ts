import {inject, Injectable, signal} from '@angular/core';
import {CartList} from '@/models/cart';
import {CookieService} from 'ngx-cookie-service';

@Injectable({providedIn: 'root'})
export class CartStore {
    private readonly carts$ = signal<Partial<CartList>>({});
    private readonly cookieService = inject(CookieService);

    get carts() {
        return this.carts$.asReadonly();
    }

    set update(value: Partial<CartList>) {
        this.carts$.set(value);
    }

    clearId() {
        this.cookieService.delete('sn_cart_id');
    }
}
