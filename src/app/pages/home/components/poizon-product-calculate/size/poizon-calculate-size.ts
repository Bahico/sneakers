import {Component, output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgOptimizedImage} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  templateUrl: 'poizon-calculate-size.html',
  selector: 'poizon-calculate-size',
  imports: [
    FormsModule,
    NgOptimizedImage,
    RouterLink
  ]
})
export class PoizonCalculateSize {
  previous = output<void>();
  next = output<void>();
  close = output<void>();

  size = signal<string>(null);
}
