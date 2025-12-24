import {Injectable, signal} from '@angular/core';
import {Brand} from '@/models/brand';
import {SizeTable} from '@/models/size-table.model';
import {FormControl} from '@angular/forms';

@Injectable({providedIn: 'root'})
export class ProductFilterStore {
  readonly brands = signal<Brand[]>([]);
  readonly sizeTables = signal<SizeTable[]>([]);
  readonly minMaxControl = signal([4, 6]);


  readonly minPrice = signal(0);
  readonly maxPrice = signal(10);
}
