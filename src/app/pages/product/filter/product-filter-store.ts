import {Injectable, signal} from '@angular/core';
import {Brand} from '@/models/brand';
import {SizeTable} from '@/models/size-table.model';
import {FormControl} from '@angular/forms';
import {form} from '@angular/forms/signals';

@Injectable({providedIn: 'root'})
export class ProductFilterStore {
  readonly brands = signal<Brand[]>([]);
  readonly sizeTables = signal<SizeTable[]>([]);
  readonly minPrice = signal(0);
  readonly maxPrice = signal(10);

  readonly filter = form(signal({
    minMax: [4, 6],
  }))
}
