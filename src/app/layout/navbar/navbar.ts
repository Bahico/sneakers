import {Component, computed, inject} from '@angular/core';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {IconComponent} from '@/components/icon/icon';
import {TuiDropdownDirective, TuiDropdownManual, TuiDropdownOptionsDirective} from '@taiga-ui/core';
import {TuiActiveZone, TuiObscured} from '@taiga-ui/cdk';
import {AccountStore} from '@/account';
import {AuthenticationOpen} from '@/components/authentication/authentication-open';
import {RouterLink} from '@angular/router';
import {TuiBadgedContentComponent, TuiBadgeNotification} from '@taiga-ui/kit';
import {CartStore} from '@/cart';

@Component({
  selector: 'navbar',
  templateUrl: 'navbar.html',
  styleUrl: 'navbar.css',
  imports: [
    NgOptimizedImage,
    IconComponent,
    TuiDropdownDirective,
    TuiDropdownManual,
    TuiObscured,
    TuiActiveZone,
    TuiDropdownOptionsDirective,
    NgClass,
    RouterLink,
    TuiBadgedContentComponent,
    TuiBadgeNotification
  ],
  host: {
    class: 'flex w-full justify-center'
  }
})
export default class Navbar {
  private readonly accountStore = inject(AccountStore);
  private readonly authenticationService = inject(AuthenticationOpen);
  private readonly cartStore = inject(CartStore);

  protected readonly isAuthed = computed(() => !!this.accountStore.account());
  protected open = false;

  protected readonly basketProductCount = computed(() => this.cartStore.carts().count);

  openAuthentication() {
    this.authenticationService.openModal()
  }

  protected onClick(): void {
    this.open = !this.open;
  }

  protected onObscured(obscured: boolean): void {
    if (obscured) {
      this.open = false;
    }
  }

  protected onActiveZone(active: boolean): void {
    this.open = active && this.open;
  }
}
