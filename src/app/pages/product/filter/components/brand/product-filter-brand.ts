import {Component, computed, effect, inject, signal} from '@angular/core';
import {IconComponent} from '@/components/icon/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TuiCheckbox} from '@taiga-ui/kit';
import {ProductFilterStore} from '@/product/filter/product-filter-store';
import {Brand} from '@/models/brand';

@Component({
  templateUrl: 'product-filter-brand.html',
  selector: 'product-filter-brand',
  imports: [
    IconComponent,
    ReactiveFormsModule,
    TuiCheckbox,
    FormsModule
  ]
})
export class ProductFilterBrand {
  private readonly productFilterStore = inject(ProductFilterStore);

  protected readonly letters = signal<{[key: string]: Brand[]}>({});
  protected readonly lettersArraySorted = computed(() => Object.keys(this.letters()).sort());

  constructor() {
    effect(() => {
      const letters: {[key: string]: Brand[]} = {};
      for (const brand of this.productFilterStore.brands()) {
        letters[brand.name[0]?.toUpperCase()] = [...(letters[brand.name[0]?.toUpperCase()] || []), brand];
      }
      this.letters.set(letters);
    });
  }

  checkBrand(id: string) {
    return this.productFilterStore.filter.controls.brand_ids.value.includes(id);
  }

  clickBrand(id: string) {
    const brand_ids = this.productFilterStore.filter.controls.brand_ids.value
    if (this.checkBrand(id)) {
      const indexOf = brand_ids.indexOf(id);
      brand_ids.splice(indexOf, 1);
    } else {
      brand_ids.push(id);
    }
    this.productFilterStore.filter.controls.brand_ids.setValue(brand_ids);
  }
}
