import {Component, inject, input, output, signal} from '@angular/core';
import {IconComponent} from '@/components/icon/icon';
import {ProductFilterPrice} from '@/product/filter/components/price/product-filter-price';
import {ProductFilterBrand} from '@/product/filter/components/brand/product-filter-brand';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TuiLabel} from '@taiga-ui/core';
import {TuiRadioComponent} from '@taiga-ui/kit';
import {SORT} from '@/product/filter/product-filter.constans';
import {ProductFilterMobileSize} from '@/product/filter/components/mobile-size/product-filter-mobile-size';
import {ProductFilterStore} from '@/product/filter/product-filter-store';

@Component({
  templateUrl: 'mobile-filter.html',
  selector: 'mobile-filter',
  host: {
    class: 'bg-white overflow-hidden fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-100 duration-300',
    '[class.max-h-0]': '!openFilter()',
    '[class.overflow-y-auto]': 'openFilter()',
    '[class.pb-40]': 'openFilter()',
    '[class.max-h-screen]': 'openFilter()',
    '[class.p-2]': 'openFilter()',
  },
  imports: [
    IconComponent,
    ProductFilterPrice,
    ProductFilterBrand,
    ReactiveFormsModule,
    TuiLabel,
    FormsModule,
    TuiRadioComponent,
    ProductFilterMobileSize
  ]
})
export class MobileFilter {
  protected readonly productFilterStore = inject(ProductFilterStore);

  openFilter = input(false);
  openFilterChange = output<boolean>();

  protected readonly sorts = SORT;

  typeView = signal<'size' | 'brand' | null>(null);

  protected identityMatcher = (a: {name: string; key: string}, b: {name: string; key: string}): boolean =>
    a?.key === b?.key;

  back() {
    if (this.typeView()) {
      this.typeView.set(null);
      return;
    }
    this.openFilterChange.emit(false);
  }
}
