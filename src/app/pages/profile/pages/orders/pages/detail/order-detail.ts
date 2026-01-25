import {afterNextRender, Component, computed, inject, signal} from '@angular/core';
import {OrderDetailModel} from '@/models/order';
import {OrderService} from '@/services/order.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {IconComponent} from '@/components/icon/icon';
import {StepsComponent} from '@/profile/pages/orders/pages/detail/step';
import {FormsModule} from '@angular/forms';
import {AsyncPipe, DatePipe} from '@angular/common';
import {NgxMaskPipe} from 'ngx-mask';
import {TuiFormatNumberPipe} from '@taiga-ui/core';
import {StepItem, StepsTimeline} from '@/profile/pages/orders/pages/detail/steps-timeline';
import {injectRegisterIcons} from '@ngneat/svg-icon';
import {checkedIcon} from '../../../../../../svg/checked';
import {boxIcon} from '../../../../../../svg/box';
import {courierIcon} from '../../../../../../svg/courier';
import {finishIcon} from '../../../../../../svg/finish';

@Component({
  templateUrl: 'order-detail.html',
  selector: 'order-detail',
  imports: [
    IconComponent,
    RouterLink,
    StepsComponent,
    FormsModule,
    DatePipe,
    NgxMaskPipe,
    AsyncPipe,
    TuiFormatNumberPipe,
    StepsTimeline
  ]
})
export default class OrderDetail {
  private readonly orderService = inject(OrderService);
  private readonly route = inject(ActivatedRoute);

  detail = signal<OrderDetailModel>(null);

  orderSteps = [
    { label: 'Оплачен', icon: 'checked' },
    { label: 'На закупке', icon: 'box' },
    { label: 'Доставляется', icon: 'courier' },
    { label: 'Готов к выдаче', icon: 'finish' },
    { label: 'Выдан', icon: 'checked' },
  ];

  steps: StepItem[] = [
    { title: 'Оплачен', date: '12.12.2025', status: 'done' },
    { title: 'На закупке', status: 'done' },
    { title: 'На складе в Китае', status: 'pending' },
    { title: 'Отправлено в РФ', status: 'pending' },
    { title: 'Принят на складе в РФ', status: 'pending' },
    { title: 'Передан в доставку до конечного пункта', status: 'pending' },
    { title: 'Готов к выдаче', status: 'pending' },
    { title: 'Вручен', status: 'pending' },
  ];


  paidSum = computed(() => {
    const detail = this.detail();
    if (detail?.is_split_payment) {
      if (detail.second_payment_completed) {
        return detail.total_amount;
      }
      if (detail.first_payment_completed) {
        return detail.first_payment_amount;
      }
      return 0;
    }
    return detail?.total_amount;
  });

  activeStep = computed(() => {
    switch (this.detail().status) {
      case 'partially_paid':
      case 'paid':
        return 0;
      case 'delivering':
        return 2;

      default:
        return 1;
    }
  })


  constructor() {
    afterNextRender(() => {
      this.loadOrderDetail();
    });
    injectRegisterIcons([
      checkedIcon,
      boxIcon,
      courierIcon,
      finishIcon
    ])
  }

  loadOrderDetail() {
    this.orderService
      .detail(this.route.snapshot.params['id'])
      .subscribe(data => {
        this.detail.set(data);
      });
  }
}
