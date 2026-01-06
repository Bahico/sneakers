import {Component, inject, input, model} from '@angular/core';
import {ProductListDetailModel} from '@/models/product.model';
import {AsyncPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TuiFormatNumberPipe, TuiIcon} from '@taiga-ui/core';
import {ResponsiveBreakpointsService} from '@/services/responsive-breakpoints.service';
import {FavoritesService} from '@/services/favorites.service';

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

  detail = model.required<ProductListDetailModel>();
  onHome = input(false);
  isMobile = this.rbs.isMobile;

  clickFavor() {
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
