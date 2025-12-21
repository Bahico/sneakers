import {Injectable, signal} from '@angular/core';
import {CartList} from '@/models/cart';

@Injectable({providedIn: 'root'})
export class CartStore {
    private readonly carts$ = signal<Partial<CartList>>({});

    get carts() {
        return this.carts$.asReadonly();
    }

    set update(value: Partial<CartList>) {
        this.carts$.set(value);
    }
}
