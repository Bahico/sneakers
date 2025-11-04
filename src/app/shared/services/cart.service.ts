import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint} from '@/get-endpoint';

@Injectable({providedIn: 'root'})
export class CartService {
  private readonly http = inject(HttpClient);

  loadCart() {
    this.http.get(getEndpoint('cart/'))
      .subscribe(res => {
        console.log(res)
      })
  }
}
