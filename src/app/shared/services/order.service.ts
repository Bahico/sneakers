import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint} from '@/get-endpoint';
import {PaymentModel, PaymentRes} from '@/models/basket';
import {OrderDetailModel, OrderListDetailModel, OrderType} from '@/models/order';

@Injectable({providedIn: 'root'})
export class OrderService {
  private readonly http = inject(HttpClient);

  private readonly endpoint = getEndpoint('orders/payment');

  payment(data: PaymentModel) {
    return this.http.post<PaymentRes>(this.endpoint + '/', data);
  }

  payFull(id: string) {
    return this.http.get<PaymentRes>(`${this.endpoint}/${id}/second-payment/`);
  }

  checkPromocode(data: {promocode: string; product_id?: string}) {
    return this.http.get<{message: {discount_value: number; promo_type: 'percent' | 'fixed'}}>(`${this.endpoint}/check-promocode`, {params: data});
  }

  orders(params: {limit: number; offset: number; status_filter?: OrderType}) {
    return this.http.get<OrderListDetailModel[]>(getEndpoint('orders/'), {params});
  }

  detail(order_number: string) {
    return this.http.get<OrderDetailModel>(getEndpoint(`orders/${order_number}`));
  }
}
