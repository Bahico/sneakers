import {Component, signal} from '@angular/core';
import {PoizonCalculateLink} from './link/poizon-calculate-link';
import {PoizonCalculateSize} from './size/poizon-calculate-size';
import {injectContext} from '@taiga-ui/polymorpheus';
import {TuiDialogContext} from '@taiga-ui/core';
import {PoizonCalculatePrice} from './price/poizon-calculate-price';

@Component({
  templateUrl: 'poizon-product-calculate.html',
  imports: [
    PoizonCalculateLink,
    PoizonCalculateSize,
    PoizonCalculatePrice
  ],
  selector: 'poizon-product-calculate'
})
export class PoizonProductCalculate {
  protected readonly context = injectContext<TuiDialogContext<void, void>>();

  stageLength = 4;
  stages = new Array(this.stageLength).fill(0).map((_, i) => i);
  currentStage = signal(0);

  close() {
    this.context.$implicit.complete();
  }
}
