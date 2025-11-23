import {Component, input, output, signal} from '@angular/core';
import {IconComponent} from '@/components/icon/icon';
import {TuiSegmented} from '@taiga-ui/kit';

@Component({
  templateUrl: 'delivery-type-inputs.html',
  selector: 'delivery-type-inputs',
  imports: [
    IconComponent,
    TuiSegmented
  ]
})
export class DeliveryTypeInputs {
  readonly = input<boolean>(false);
  openModal = output<boolean>();

  protected readonly activeSegment = signal(0);
}
