import {Injectable, signal} from '@angular/core';
import {ListResult} from '@/models/list-result';
import {CartList} from '@/models/cart';

@Injectable({providedIn: 'root'})
export class CartStore {
    private readonly carts$ = signal<Partial<ListResult<CartList>>>({});

    get carts() {
        return this.carts$.asReadonly();
    }

    set update(value: Partial<ListResult<CartList>>) {
        this.carts$.set(value);
    }
}
