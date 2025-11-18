import {Component, output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgOptimizedImage} from '@angular/common';

@Component({
  templateUrl: 'poizon-calculate-price.html',
  selector: 'poizon-calculate-price',
  imports: [
    FormsModule,
    NgOptimizedImage
  ]
})
export class PoizonCalculatePrice {
  previous = output<void>();
  next = output<void>();

  price = signal<string>(null);
}
