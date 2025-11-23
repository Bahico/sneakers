import {Component, model, signal} from '@angular/core';
import {AngularYandexMapsModule} from 'angular8-yandex-maps';
import {NgClass, NgTemplateOutlet} from '@angular/common';
import {DeliveryTypeInputs} from '@/basket/create/delivery-type-inputs/delivery-type-inputs';
import {IconComponent} from '@/components/icon/icon';

@Component({
  selector: 'delivery-place',
  templateUrl: 'delivery-place.html',
  imports: [
    AngularYandexMapsModule,
    NgClass,
    DeliveryTypeInputs,
    IconComponent,
    NgTemplateOutlet
  ],
})
export class DeliveryPlace {
  open = model(false);
}
