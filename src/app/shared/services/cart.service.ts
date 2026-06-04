import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getEndpoint } from '@/get-endpoint';
import { CartAdd, CartList } from '@/models/cart';
import { CartStore } from '@/cart';
import { Observable, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly cartStore = inject(CartStore);

  loadCart(force = false) {
    if (force) {
      this.cartStore.update = {
        items: [],
        total_items: 0,
        total_price: 0
      };
      return of({
        items: [],
        total_items: 0,
        total_price: 0
      });
    }
    return this.http.get<CartList>(getEndpoint('cart/')) // {params: {session_id: this.getCartId()}}
      .pipe(tap(res => {
        this.cartStore.update = res;
      }))
  }

  addCart(data: CartAdd) {
    return this.updateSize(this.http.post<CartList>(getEndpoint('cart/add'), data));
  }

  changeQuantity(id: string, quantity = 1) {
    return this.updateSize(this.http.patch<CartList>(getEndpoint(`cart/item/${id}`), { quantity })) // {params: {session_id: this.getCartId()}}
  }

  deleteCart(id: string) {
    return this.updateSize(this.http.delete<CartList>(getEndpoint(`cart/item/${id}`))); // {params: {session_id: this.getCartId()}}
  }

  private updateSize(source: Observable<CartList>) {
    return source
      .pipe(tap((res) => {
        this.cartStore.update = res
      }));
  }
}
