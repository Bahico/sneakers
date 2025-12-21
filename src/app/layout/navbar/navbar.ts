import {Component, computed, inject, signal} from '@angular/core';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {IconComponent} from '@/components/icon/icon';
import {TuiDropdownDirective, TuiDropdownManual, TuiDropdownOptionsDirective, TuiIconPipe} from '@taiga-ui/core';
import {TuiActiveZone, TuiObscured} from '@taiga-ui/cdk';
import {AccountStore} from '@/account';
import {AuthenticationOpen} from '@/components/authentication/authentication-open';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {TuiBadgedContentComponent, TuiBadgeNotification} from '@taiga-ui/kit';
import {CartStore} from '@/cart';
import {ProductDetailStore} from '@/product/detail/services/product-detail-store';

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
    TuiBadgeNotification,
    TuiIconPipe,
    RouterLinkActive
  ],
  host: {
    class: 'flex w-full justify-center'
  }
})
export default class Navbar {
  private readonly accountStore = inject(AccountStore);
  private readonly authenticationService = inject(AuthenticationOpen);
  private readonly cartStore = inject(CartStore);
  private readonly productDetailStore = inject(ProductDetailStore);
  private readonly router = inject(Router);

  protected readonly isAuthed = computed(() => !!this.accountStore.account());
  protected open = false;
  protected readonly openMobileNavbar = signal(false);

  protected readonly basketProductCount = computed(() => this.cartStore.carts().total_items);

  openCartBtn = computed(() => !!this.productDetailStore.selectedSkus());
  addedCart = computed(() =>
    this.productDetailStore.selectedSkus() &&
    this.cartStore.carts()?.items?.find(item => item.sku.id === this.productDetailStore.selectedSkus()?.id)
  );

  logout() {
    this.accountStore.logout();
    this.router.navigate(['/']);
  }

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

  openMobileCart() {
    this.productDetailStore.mobileAddCart();
  }
}
