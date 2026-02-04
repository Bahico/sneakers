import {afterNextRender, Component, computed, inject, signal} from '@angular/core';
import {OrderDetailModel, OrderType} from '@/models/order';
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
import {checkedIcon} from '@/checked';
import {boxIcon} from '@/box';
import {courierIcon} from '@/courier';
import {finishIcon} from '@/finish';
import { handMoneyIcon } from '@/hand-money';

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

  orderSteps = computed(() => {
    const baseSteps = [
      { label: 'Оплачен', icon: 'checked' },
      { label: 'На закупке', icon: 'box' },
      { label: 'Доставляется', icon: 'courier' },
      { label: 'Готов к выдаче', icon: 'finish' },
      { label: 'Выдан', icon: 'checked' },
    ];

    const detail = this.detail();
    if (detail?.is_split_payment) {
      return [
        { label: 'Част. оплачен', icon: 'hand-money' },
        baseSteps[1], // 'На закупке' at index 1
        baseSteps[0], // 'Оплачен' at index 2
        ...baseSteps.slice(2), // Rest of the steps
      ];
    }

    return baseSteps;
  });

  steps = computed(() => {
    const detail = this.detail();
    if (!detail) {
      return [];
    }

    const status = detail.status;
    const isSplitPayment = detail.is_split_payment;

    // Define all possible steps
    const allSteps: Array<{ title: string; statusKey: OrderType }> = [
      { title: 'Част. оплачен', statusKey: 'partially_paid' },
      { title: 'Оплачен', statusKey: 'paid' },
      { title: 'На закупке', statusKey: 'purchasing' },
      { title: 'На складе в Китае', statusKey: 'china_warehouse' },
      { title: 'Отправлено в РФ', statusKey: 'arrived_in_country' },
      { title: 'Принят на складе в РФ', statusKey: 'returned' },
      { title: 'Передан в доставку до конечного пункта', statusKey: 'in_transit' },
      { title: 'Готов к выдаче', statusKey: 'ready_for_pickup' },
      { title: 'Вручен', statusKey: 'delivered' },
    ];

    // Filter steps based on split payment
    let filteredSteps: Array<{ title: string; statusKey: OrderType }>;
    if (isSplitPayment) {
      // Include all steps for split payment
      filteredSteps = allSteps;
    } else {
      // Exclude "Част. оплачен" for non-split payment
      filteredSteps = allSteps.filter(step => step.statusKey !== 'partially_paid');
    }

    // Map status progression
    const statusOrder: OrderType[] = isSplitPayment
      ? ['partially_paid', 'paid', 'purchasing', 'china_warehouse', 'arrived_in_country', 'returned', 'in_transit', 'ready_for_pickup', 'delivered']
      : ['paid', 'purchasing', 'china_warehouse', 'arrived_in_country', 'returned', 'in_transit', 'ready_for_pickup', 'delivered'];

    const currentStatusIndex = statusOrder.indexOf(status);
    const activeIndex = currentStatusIndex >= 0 ? currentStatusIndex : -1;

    return filteredSteps.map((step) => {
      let stepStatus: 'done' | 'active' | 'pending';
      const stepStatusIndex = statusOrder.indexOf(step.statusKey);

      if (stepStatusIndex === -1) {
        // Step not in status order, mark as pending
        stepStatus = 'pending';
      } else if (activeIndex === -1) {
        // Current status not found, mark all as pending
        stepStatus = 'pending';
      } else if (stepStatusIndex < activeIndex) {
        // Step is before current status, mark as done
        stepStatus = 'done';
      } else if (stepStatusIndex === activeIndex) {
        // Step matches current status, mark as active
        stepStatus = 'active';
      } else {
        // Step is after current status, mark as pending
        stepStatus = 'pending';
      }

      return {
        title: step.title,
        status: stepStatus,
      };
    });
  });

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
    const detail = this.detail();
    if (!detail) {
      return 0;
    }

    const status = detail.status;
    const isSplitPayment = detail.is_split_payment;

    // Map status to step index in orderSteps
    if (isSplitPayment) {
      switch (status) {
        case 'partially_paid':
          return 0; // 'Част. оплачен'
        case 'paid':
          return 2; // 'Оплачен'
        case 'purchasing':
          return 1; // 'На закупке'
        case 'china_warehouse':
        case 'arrived_in_country':
        case 'returned':
        case 'in_transit':
          return 3; // 'Доставляется'
        case 'ready_for_pickup':
          return 4; // 'Готов к выдаче'
        case 'delivered':
          return 5; // 'Выдан'
        default:
          return 0;
      }
    } else {
      switch (status) {
        case 'paid':
          return 0; // 'Оплачен'
        case 'purchasing':
          return 1; // 'На закупке'
        case 'china_warehouse':
        case 'arrived_in_country':
        case 'returned':
        case 'in_transit':
        case 'delivering':
        case 'delivering_by_courier':
          return 2; // 'Доставляется'
        case 'ready_for_pickup':
          return 3; // 'Готов к выдаче'
        case 'delivered':
          return 4; // 'Выдан'
        default:
          return 0;
      }
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
      finishIcon,
      handMoneyIcon
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
