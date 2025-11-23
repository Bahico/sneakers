import {Component, signal} from '@angular/core';
import {AngularYandexMapsModule} from 'angular8-yandex-maps';
import {TuiSegmented} from '@taiga-ui/kit';
import {IconComponent} from '@/components/icon/icon';

@Component({
  templateUrl: 'delivery-place.html',
  imports: [
    AngularYandexMapsModule,
    TuiSegmented,
    IconComponent
  ],
  selector: 'delivery-place'
})
export class DeliveryPlace {
  protected readonly activeSegment = signal(0);

}
