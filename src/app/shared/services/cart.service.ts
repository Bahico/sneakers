import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint} from '@/get-endpoint';
import {ListResult} from '@/models/list-result';
import {CartAdd, CartList, Summary} from '@/models/cart';
import {CartStore} from '@/cart';
import {finalize, Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly cartStore = inject(CartStore);

  loadCart() {
    this.http.get<ListResult<CartList>>(getEndpoint('cart/'))
      .subscribe(res => {
        this.cartStore.update = res;
      })
  }

  summary() {
    return this.http.get<Summary>(getEndpoint('cart/summary/'))
  }

  addCart(data: CartAdd) {
    return this.updateFn(this.http.post(getEndpoint('cart/'), data));
  }

  decrease(id: number) {
    return this.updateSize(this.http.post<{quantity: number}>(getEndpoint(`cart/${id}/increase/`), {}), id);
  }

  increase(id: number) {
    return this.updateSize(this.http.post<{quantity: number}>(getEndpoint(`cart/${id}/increase/`), {}), id);
  }

  updateCart(data: CartList) {
    return this.updateFn(this.http.put(getEndpoint(`cart/${data.id}/`), data));
  }

  deleteCart(id: number) {
    return this.updateFn(this.http.delete(getEndpoint(`cart/${id}/`)));
  }

  clear() {
    return this.updateFn(this.http.delete(getEndpoint(`cart/clear/`)));
  }

  private updateSize(source: Observable<{quantity: number}>, id: number) {
    return source
      .pipe(finalize(() => {
        this.cartStore.update = {
          ...this.cartStore.carts(),
          results: this.cartStore.carts().results.map(item => {
            if (item.id === id) {
              return {
                ...item,
                quantity: item.quantity
              }
            }
            return item;
          })
        };

      }));
  }

  private updateFn<T>(source: Observable<T>) {
    return source
      .pipe(finalize(() => this.loadCart()));
  }
}
