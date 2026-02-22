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
import { injectRegisterIcons, SvgIconComponent } from '@ngneat/svg-icon';
import {checkedIcon} from '@/checked';
import {boxIcon} from '@/box';
import {courierIcon} from '@/courier';
import {finishIcon} from '@/finish';
import { handMoneyIcon } from '@/hand-money';
import { copyIcon } from '@/copy';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';

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
    StepsTimeline,
    SvgIconComponent,
    CdkCopyToClipboard
]
})
export default class OrderDetail {
  private readonly orderService = inject(OrderService);
  private readonly route = inject(ActivatedRoute);

  detail = signal<OrderDetailModel>(null);
  copySuccess = signal(false);

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

  steps = computed(() => {
    const detail = this.detail();
    if (!detail) {
      return [];
    }

    const status = detail.status;
    const isSplitPayment = detail.is_split_payment;
    const isCdekCourier = detail.delivery_type === 'cdek_courier';

    // Normal flow steps: title + statusKey (statusKey optional for terminal steps)
    const flowSteps: Array<{ title: string; statusKey: OrderType | null }> = [
      ...(isSplitPayment ? [{ title: 'Частично оплачен', statusKey: 'partially_paid' as OrderType }] : [{ title: 'Оплачен', statusKey: 'paid' as OrderType }]),
      { title: 'На закупке', statusKey: isSplitPayment ? 'photo_report_ready' : 'purchasing' },
      ...(isSplitPayment ? [{ title: 'Оплачен', statusKey: 'paid' as OrderType }] : []),
      { title: 'На складе в Китае', statusKey: 'china_warehouse' },
      { title: 'Отправлено в РФ', statusKey: 'sent_to_russia' },
      { title: 'Принят на склад в РФ', statusKey: 'arrived_in_country' },
      { title: 'Передан в доставку до конечного пункта', statusKey: 'in_transit' },
      { title: 'Готов к выдаче', statusKey: 'ready_for_pickup' },
      ...(isCdekCourier ? [{ title: 'Доставляется\nкурьером', statusKey: 'delivering_by_courier' as OrderType }] : []),
      { title: 'Вручен', statusKey: 'delivered' },
    ];

    const statusOrder: OrderType[] = [
      ...(isSplitPayment ? ['partially_paid' as OrderType] : ['paid' as OrderType]),
      ...(isSplitPayment ? ['photo_report_ready' as OrderType] : ['purchasing' as OrderType]),
      ...(isSplitPayment ? ['paid' as OrderType] : []),
      'china_warehouse',
      'sent_to_russia',
      'arrived_in_country',
      'in_transit',
      'ready_for_pickup',
      ...(isCdekCourier ? ['delivering_by_courier' as OrderType] : []),
      'delivered',
    ];

    const isTerminal = status === 'cancelled' || status === 'returned';
    const currentStatusIndex = statusOrder.indexOf(status);

    return flowSteps.map((step) => {
      let stepStatus: 'done' | 'active' | 'pending';
      if (isTerminal) {
        stepStatus = 'pending';
      } else if (step.statusKey === null) {
        stepStatus = 'pending';
      } else {
        const stepStatusIndex = statusOrder.indexOf(step.statusKey);
        const activeIndex = currentStatusIndex >= 0 ? currentStatusIndex : -1;
        if (stepStatusIndex === -1 || activeIndex === -1) {
          stepStatus = 'pending';
        } else if (stepStatusIndex < activeIndex) {
          stepStatus = 'done';
        } else if (stepStatusIndex === activeIndex) {
          stepStatus = 'active';
        } else {
          stepStatus = 'pending';
        }
      }
      return { title: step.title, status: stepStatus };
    }).concat(
      status === 'cancelled'
        ? [{ title: 'Отменен', status: 'active' as const }]
        : status === 'returned'
          ? [{ title: 'Возврат', status: 'active' as const }]
          : []
    );
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
        return 1 + offset;
      case 'purchasing':
        return 2 + offset;
      case 'china_warehouse':
      case 'arrived_in_country':
      case 'sent_to_russia':
      case 'in_transit':
      case 'delivering':
        return 3 + offset; // Доставляется
      case 'ready_for_pickup':
        return 3 + offset;
      case 'delivering_by_courier':
        return isCdekCourier ? 4 + offset : 3 + offset;
      case 'delivered':
        return (isCdekCourier ? 6 : 5) + offset; // Вручен
      default:
        return 0;
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
      handMoneyIcon,
      copyIcon
    ])
  }

  loadOrderDetail() {
    this.orderService
      .detail(this.route.snapshot.params['order_number'])
      .subscribe(data => {
        this.detail.set(data);
      });
  }

  copyCdekNumber() {
    this.copySuccess.set(true);
    setTimeout(() => {
      this.copySuccess.set(false);
    }, 3000);
  }

  payFull() {
    this.orderService.payFull(this.detail()?.id).subscribe(res => {
      if (res?.success) {
        this.openPaymentModal(res.payment.payment_url);
      }
    });
  }

  openPaymentModal(payment_url: string) {
    const width = 600;
    const height = 600;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;

    const features = 'width=700' + ', height=800' +
      ', top=' + top + ', left=' + left +
      ', resizable=yes, scrollbars=yes, status=no, menubar=no, toolbar=no';
    const newWindow = window.open(payment_url, 'payment', features);

    if (newWindow) {
      newWindow.focus();
      const polling = setInterval(() => {
        if (newWindow.closed) {
          clearInterval(polling);
          this.loadOrderDetail();
        }
      }, 500);

    }
  }
}
