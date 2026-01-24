import {Component, inject, signal} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {TuiBreadcrumbs} from '@taiga-ui/kit';
import {TuiLink} from '@taiga-ui/core';
import {TuiItem} from '@taiga-ui/cdk';
import {ProfileMenu} from '@/profile/components/menu/profile-menu';
import {IconComponent} from '@/components/icon/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

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

  search = signal<string>('');

  navigateOrder() {
    this.router.navigateByUrl(`/profile/orders/${this.search()}`);
  }
}
