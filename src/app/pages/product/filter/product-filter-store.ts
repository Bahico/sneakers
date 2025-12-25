import {Injectable, signal} from '@angular/core';
import {Brand} from '@/models/brand';
import {SizeTable} from '@/models/size-table.model';
import {FormArray, FormControl, FormGroup} from '@angular/forms';

@Injectable({providedIn: 'root'})
export class ProductFilterStore {
  readonly brands = signal<Brand[]>([]);
  readonly sizeTables = signal<SizeTable[]>([]);
  readonly minPrice = signal(0);
  readonly maxPrice = signal(10);

  readonly filter = new FormGroup({
    min_max_price: new FormControl([0, 0]),
    sizes: new FormControl([]),
    brand_ids: new FormControl([]),
    sort_by: new FormControl(null)
  });
}
