import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint} from '@/get-endpoint';
import {CartAdd, CartList} from '@/models/cart';
import {CartStore} from '@/cart';
import {finalize, Observable, tap} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';

@Injectable({providedIn: 'root'})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly cartStore = inject(CartStore);
  private readonly cookieService = inject(CookieService);

  setCartId(id: string) {
    this.cookieService.set('sn_cart_id', id, new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), '/');
  }

  getCartId() {
    return this.cookieService.get('sn_cart_id');
  }

  loadCart() {
    return this.http.get<CartList>(getEndpoint('cart/')) // {params: {session_id: this.getCartId()}}
      .pipe(tap(res => {
        this.cartStore.update = res;
      }))
  }

  addCart(data: CartAdd) {
    return this.updateSize(this.http.post<CartList>(getEndpoint('cart/add'), data));
  }

  changeQuantity(id: string, quantity = 1) {
    return this.updateSize(this.http.patch<CartList>(getEndpoint(`cart/item/${id}`), {quantity})) // {params: {session_id: this.getCartId()}}
  }

  deleteCart(id: string) {
    return this.updateSize(this.http.delete<CartList>(getEndpoint(`cart/item/${id}`))); // {params: {session_id: this.getCartId()}}
  }

  clear() {
    return this.http.delete(getEndpoint(`cart/clear`)); // {params: {session_id: this.getCartId()}}
  }

  private updateSize(source: Observable<CartList>) {
    return source
      .pipe(tap((res) => {
        this.cartStore.update = res
      }));
  }
}
