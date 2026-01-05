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

  protected readonly search = signal('');
  protected readonly letters = signal<{[key: string]: Brand[]}>({});
  protected readonly lettersArraySorted = computed(() => Object.keys(this.letters()).sort());

  protected readonly brands = signal<Brand[]>([]);

  constructor() {
    effect(() => {
      this.setLetters();
    });
    effect(() => {
      this.brands.set(this.productFilterStore.brands());
    });
  }

  setLetters() {
    const letters: {[key: string]: Brand[]} = {};
    for (const brand of this.brands()) {
      letters[brand.name[0]?.toUpperCase()] = [...(letters[brand.name[0]?.toUpperCase()] || []), brand];
    }
    this.letters.set(letters);
  }

  searchBrand() {
    this.brands.set(
      this.productFilterStore.brands().filter(brand => brand.name.toLowerCase().includes(this.search().toLowerCase()))
    );
    this.setLetters();
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
