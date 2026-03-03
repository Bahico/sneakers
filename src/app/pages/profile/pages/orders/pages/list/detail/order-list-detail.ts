import {Component, computed, input} from '@angular/core';
import {OrderListDetailModel} from '@/models/order';
import {RouterLink} from '@angular/router';
import {IconComponent} from '@/components/icon/icon';
import {injectRegisterIcons, SvgIconComponent} from '@ngneat/svg-icon';
import {rightIcon} from '@/right';
import {checkedIcon} from '@/checked';

@Component({
  templateUrl: 'order-list-detail.html',
  selector: 'order-list-detail',
  imports: [
    RouterLink,
    IconComponent,
    SvgIconComponent
  ]
})
export class OrderListDetail {
  detail = input.required<OrderListDetailModel>();
  last = input.required<boolean>();

  orderSteps = computed(() => {
    const detail = this.detail();
    const steps: Array<{ label: string; icon: string }> = [];

    if (detail?.is_split_payment) {
      steps.push({ label: 'Частично оплачен', icon: 'hand-money' });
    } else {
      steps.push({ label: 'Оплачен', icon: 'checked' });
    }
    steps.push({ label: 'На закупке', icon: 'box' });
    if (detail?.is_split_payment) {
      steps.push({ label: 'Оплачен', icon: 'checked' });
    }
    steps.push({ label: 'Доставляется', icon: 'courier' });
    steps.push({ label: 'Готов к выдаче', icon: 'finish' });
    if (detail?.delivery_type === 'cdek_courier') {
      steps.push({ label: 'Доставляется курьером', icon: 'courier' });
    }
    steps.push({ label: 'Вручен', icon: 'checked' });

    return steps;
  });

  activeStep = computed(() => {
    const detail = this.detail();
    if (!detail) {
      return 0;
    }

    const status = detail.status;
    const isSplitPayment = detail.is_split_payment;
    const isCdekCourier = detail.delivery_type === 'cdek_courier';
    const offset = isSplitPayment ? 1 : 0; // extra step "Частично оплачен" at 0

    // Terminal statuses: no matching horizontal step
    if (status === 'cancelled' || status === 'returned') {
      return 0;
    }


    switch (status) {
      case 'partially_paid':
        return 0;
      case 'photo_report_ready':
        return 1;
      case 'paid':
        return offset ? 1 + offset : 0;
      case 'china_warehouse':
      case 'arrived_in_country':
      case 'sent_to_russia':
      case 'in_transit':
      case 'delivering':
      case 'purchasing':
        return 2 + offset;
      case 'ready_for_pickup':
        return 3 + offset;
      case 'delivering_by_courier':
        return isCdekCourier ? 4 + offset : 3 + offset;
      case 'delivered':
        return (isCdekCourier ? 6 : 5) + offset; // Вручен
      default:
        return 0;
    }
  });

  constructor() {
    injectRegisterIcons([rightIcon, checkedIcon]);
  }
}
