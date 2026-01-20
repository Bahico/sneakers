import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint} from '@/get-endpoint';
import {PaymentModel} from '@/models/basket';

@Injectable({providedIn: 'root'})
export class OrderService {
  private readonly http = inject(HttpClient);

  private readonly endpoint = getEndpoint('orders/payment');

  payment(data: PaymentModel) {
    return this.http.post(this.endpoint + '/', data);
  }

  checkPromocode(data: {promocode: string; product_id?: string}) {
    return this.http.get(`${this.endpoint}/check-promocode`, {params: data});
  }
}
