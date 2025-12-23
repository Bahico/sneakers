import {Injectable, signal} from '@angular/core';
import {Brand} from '@/models/brand';
import {SizeTable} from '@/models/size-table.model';

@Injectable({providedIn: 'root'})
export class ProductFilterStore {
  readonly brands = signal<Brand[]>([]);
  readonly sizeTables = signal<SizeTable[]>([]);
}
