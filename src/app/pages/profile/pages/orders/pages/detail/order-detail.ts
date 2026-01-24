import {afterNextRender, Component, inject, signal} from '@angular/core';
import {OrderDetailModel} from '@/models/order';
import {OrderService} from '@/services/order.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  templateUrl: 'order-detail.html',
  selector: 'order-detail',
})
export default class OrderDetail {
  private readonly orderService = inject(OrderService);
  private readonly route = inject(ActivatedRoute);

  detail = signal<OrderDetailModel>(null);

  constructor() {
    afterNextRender(() => {
      this.loadOrderDetail();
    })
  }

  loadOrderDetail() {
    this.orderService
      .detail(this.route.snapshot.params['id'])
      .subscribe(data => {
        this.detail.set(data);
      });
  }
}
