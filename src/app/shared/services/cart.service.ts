import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint} from '@/get-endpoint';
import {CartAdd, CartList} from '@/models/cart';
import {CartStore} from '@/cart';
import {finalize, Observable, tap} from 'rxjs';

@Injectable({providedIn: 'root'})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly cartStore = inject(CartStore);

  loadCart() {
    return this.http.get<CartList>(getEndpoint('cart/'))
      .pipe(tap(res => {
        this.cartStore.update = res;
      }))
  }

  addCart(data: CartAdd) {
    return this.updateFn(this.http.post<CartList>(getEndpoint('cart/add'), data));
  }

  changeQuantity(id: string, quantity = 1) {
    return this.updateSize(this.http.patch<CartList>(getEndpoint(`cart/item/${id}`), {quantity}))
  }

  deleteCart(id: string) {
    return this.updateSize(this.http.delete<CartList>(getEndpoint(`cart/item/${id}`)));
  }

  clear() {
    return this.updateFn(this.http.delete(getEndpoint(`cart/clear/`)));
  }

  private updateSize(source: Observable<CartList>) {
    return source
      .pipe(tap((res) => {
        this.cartStore.update = res

      }));
  }

  private updateFn<T>(source: Observable<T>) {
    return source
      .pipe(finalize(() => this.loadCart().subscribe()));
  }
}
