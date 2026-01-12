import {Component, model} from '@angular/core';
import {YaEvent, YaMapComponent, YaPlacemarkDirective} from 'angular8-yandex-maps';
import {NgClass, NgTemplateOutlet} from '@angular/common';
import {DeliveryTypeInputs} from '@/basket/create/delivery-type-inputs/delivery-type-inputs';
import {IconComponent} from '@/components/icon/icon';

@Component({
  selector: 'delivery-place',
  templateUrl: 'delivery-place.html',
  imports: [
    NgClass,
    DeliveryTypeInputs,
    IconComponent,
    NgTemplateOutlet,
    YaMapComponent,
    YaPlacemarkDirective
  ],
})
export class DeliveryPlace {
  open = model(false);

  onChange(event: YaEvent<ymaps.Map>) {
    console.log(event.target.getCenter());
  }
}
