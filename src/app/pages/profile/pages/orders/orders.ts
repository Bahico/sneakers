import {afterEveryRender, Component, inject, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';
import {TuiBreadcrumbs} from '@taiga-ui/kit';
import {TuiLink} from '@taiga-ui/core';
import {TuiItem} from '@taiga-ui/cdk';
import {ProfileMenu} from '@/profile/components/menu/profile-menu';
import {IconComponent} from '@/components/icon/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';

@Component({
  templateUrl: 'orders.html',
  selector: 'orders',
  host: {class: 'flex w-full justify-center pb-10'},
  imports: [
    RouterLink,
    TuiBreadcrumbs,
    TuiLink,
    TuiItem,
    ProfileMenu,
    IconComponent,
    ReactiveFormsModule,
    FormsModule,
    RouterOutlet
  ]
})
export default class Orders {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  search = signal<string>('');

  private readonly destroy$ = new Subject<void>();

  constructor() {
    afterEveryRender(() => {
      this.subscribeRoute();
    })
  }

  subscribeRoute(): void {
    this.route
      .firstChild
      .params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['order_number']) {
          this.search.set(params['order_number']);
        }
      })
  }

  navigateOrder(): void {
    this.router.navigateByUrl(`/profile/orders/${this.search()}`);
  }
}
