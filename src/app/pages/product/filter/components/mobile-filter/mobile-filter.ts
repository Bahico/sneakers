import {Component, input, output, signal} from '@angular/core';
import {IconComponent} from '@/components/icon/icon';
import {ProductFilterPrice} from '@/product/filter/components/price/product-filter-price';
import {ProductFilterBrand} from '@/product/filter/components/brand/product-filter-brand';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TuiLabel} from '@taiga-ui/core';
import {TuiRadioComponent, TuiRadioDirective} from '@taiga-ui/kit';
import {SORT} from '@/product/filter/product-filter.constans';
import {ProductFilterMobileSize} from '@/product/filter/components/mobile-size/product-filter-mobile-size';

@Component({
  templateUrl: 'mobile-filter.html',
  selector: 'mobile-filter',
  host: {
    class: 'bg-white absolute overflow-hidden top-0 left-0 right-0 bottom-0 overflow-y-auto w-full h-screen z-10 duration-300',
    '[class.max-h-screen]': 'openFilter()',
    '[class.pb-40]': 'openFilter()',
    '[class.max-h-0]': '!openFilter()',
  },
  imports: [
    IconComponent,
    ProductFilterPrice,
    ProductFilterBrand,
    ReactiveFormsModule,
    TuiLabel,
    TuiRadioDirective,
    FormsModule,
    TuiRadioComponent,
    ProductFilterMobileSize
  ]
})
export class MobileFilter {
  openFilter = input(false);
  openFilterChange = output<boolean>();

  protected readonly sorts = SORT;

  protected readonly sort = signal(SORT[0]);
  typeView = signal<'size' | 'brand' | null>(null);

  protected identityMatcher = (a: {name: string}, b: {name: string}): boolean =>
    a?.name === b?.name;

  back() {
    if (this.typeView()) {
      this.typeView.set(null);
      return;
    }
    this.openFilterChange.emit(false);
  }
}
