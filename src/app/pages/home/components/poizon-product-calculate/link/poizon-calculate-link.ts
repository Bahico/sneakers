import {Component, output, signal} from '@angular/core';
import {IconComponent} from '@/components/icon/icon';
import {NgOptimizedImage} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  templateUrl: 'poizon-calculate-link.html',
  selector: 'poizon-calculate-link',
  imports: [
    IconComponent,
    NgOptimizedImage,
    FormsModule
  ]
})
export class PoizonCalculateLink {
  next = output<void>()

  link = signal<string>(null);
}
