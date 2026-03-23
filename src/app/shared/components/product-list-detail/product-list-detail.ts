import {Component, computed, inject, input, model} from '@angular/core';
import {ProductListDetailModel} from '@/models/product.model';
import {AsyncPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TuiFormatNumberPipe, TuiIcon} from '@taiga-ui/core';
import {ResponsiveBreakpointsService} from '@/services/responsive-breakpoints.service';
import {FavoritesService} from '@/services/favorites.service';
import { AccountStore } from '@/account';
import { AuthenticationOpen } from '@/components/authentication/authentication-open';

@Component({
  selector: 'product-list-detail',
  templateUrl: 'product-list-detail.html',
  imports: [
    RouterLink,
    AsyncPipe,
    TuiFormatNumberPipe,
    TuiIcon
  ]
})
export class ProductListDetail {
  private readonly rbs = inject(ResponsiveBreakpointsService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly accountStore = inject(AccountStore);
  private readonly authenticationOpen = inject(AuthenticationOpen);

  detail = model.required<ProductListDetailModel>();
  onHome = input(false);
  isMobile = this.rbs.isMobile;
  euSizes = computed(() => {
    const euSizeTable = this.detail().size_table.find(({type}) => type.toLowerCase() === 'eu');
    return euSizeTable?.values.join(' ') ?? '';
  });

  clickFavor() {
    if (!this.accountStore.account()?.id) {
      return this.authenticationOpen.openModal();
    }

    if (this.detail().is_favorite) {
      this.favoritesService.delete(this.detail().id).subscribe(() => {
        this.detail.set({...this.detail(), is_favorite: false});
      });
    } else {
      this.favoritesService.add(this.detail().id).subscribe(() => {
        this.detail.set({...this.detail(), is_favorite: true});
      });
    }
  }
}
