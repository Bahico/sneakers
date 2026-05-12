import {afterNextRender, Component, computed, DestroyRef, inject, signal} from '@angular/core';
import {OrderService} from '@/services/order.service';
import {OrderListDetailModel} from '@/models/order';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {OrderListDetail} from '@/profile/pages/orders/pages/list/detail/order-list-detail';

@Component({
  templateUrl: 'order-list.html',
  imports: [
    OrderListDetail
  ],
  selector: 'order-list'
})
export default class OrderList {
  private readonly orderService = inject(OrderService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly orders = signal<OrderListDetailModel[]>([]);
  protected readonly ordersForView = computed(() =>
    this.orderService.search() ?
    this.orders().filter(item => item.order_number.includes(this.orderService.search())) :
      this.orders()
  );

  constructor() {
    afterNextRender(() => {
      this.orderService.search.set('');
      this.loadOrders();
    });
  }

  loadOrders(): void {
    this.orderService.orders({limit: 10, offset: 0})
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(orders => {
        this.orders.set(orders);
      })
  }
}
