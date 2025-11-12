import {Injectable, signal} from '@angular/core';

@Injectable({providedIn: 'root'})
export class ProductFilterStore {
  currentPage = signal(1);
}
