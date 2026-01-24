import {Component, input} from '@angular/core';
import {OrderListDetailModel} from '@/models/order';
import {RouterLink} from '@angular/router';

@Component({
  templateUrl: 'order-list-detail.html',
  selector: 'order-list-detail',
  imports: [
    RouterLink
  ]
})
export class OrderListDetail {
  detail = input.required<OrderListDetailModel>();
  last = input.required<boolean>();
}
