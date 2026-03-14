import {afterNextRender, Component, computed, DestroyRef, inject, signal} from '@angular/core';
import {Location, NgClass, NgOptimizedImage} from '@angular/common';
import {IconComponent} from '@/components/icon/icon';
import {TuiDropdownDirective, TuiDropdownManual, TuiDropdownOptionsDirective, TuiIconPipe} from '@taiga-ui/core';
import {TuiActiveZone, TuiObscured} from '@taiga-ui/cdk';
import {AccountStore} from '@/account';
import {AuthenticationOpen} from '@/components/authentication/authentication-open';
import {NavigationEnd, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {TuiBadgedContentComponent, TuiBadgeNotification} from '@taiga-ui/kit';
import {CartStore} from '@/cart';
import {ProductDetailStore} from '@/product/detail/services/product-detail-store';
import {HomeStore} from '@/home.store';
import {filter} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { FavoritesService } from '@/services/favorites.service';

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
    class: 'flex w-full justify-center sticky top-0 left-0 right-0 z-10 bg-white'
  }
})
export default class Navbar {
  private readonly accountStore = inject(AccountStore);
  private readonly authenticationService = inject(AuthenticationOpen);
  private readonly cartStore = inject(CartStore);
  private readonly productDetailStore = inject(ProductDetailStore);
  private readonly router = inject(Router);
  private readonly homeStore = inject(HomeStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly location = inject(Location);
  private readonly favoritesService = inject(FavoritesService);

  protected readonly isAuthed = computed(() => !!this.accountStore.account());
  protected readonly favoritesCount = computed(() => 0);
  protected open = false;
  protected readonly openMobileNavbar = signal(false);

  protected readonly basketProductCount = computed(() => this.cartStore.carts().total_items);
  protected readonly gender = this.homeStore.gender.asReadonly();

  openCartBtn = computed(() => !!this.productDetailStore.selectedSkus());
  isSearchPage = signal(false);
  addedCart = computed(() =>
    this.productDetailStore.selectedSkus() &&
    this.cartStore.carts()?.items?.find(item => item.variant.id === this.productDetailStore.selectedSkus()?.id)
  );

  constructor() {
    afterNextRender(() => {
      this.router
        .events
        .pipe(
          filter(event => event instanceof NavigationEnd),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => {
          if (location.pathname.includes('product/search')) {
            this.isSearchPage.set(true);
          } else {
            this.isSearchPage.set(false);
          }
        })
    })
  }

  logout() {
    this.accountStore.logout();
    this.router.navigate(['/']);
  }

  openAuthentication() {
    this.authenticationService.openModal()
  }

  goBack() {
    if (this.isSearchPage()) {
      this.location.back();
    }
  }

  openMobileCart() {
    this.productDetailStore.mobileAddCart();
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
