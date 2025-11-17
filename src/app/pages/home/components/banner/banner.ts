import {Component, signal} from "@angular/core";
import {GuaranteeOriginal} from './guarantee-original/guarantee-original';

@Component({
  templateUrl: 'banner.html',
  selector: 'banner',
  imports: [
    GuaranteeOriginal
  ],
  styles: [
    `
      .slider-indicators {
        display: flex;
        gap: 40px;
        justify-content: center;
        padding: 40px 0;
        width: 100%;
      }

      .indicator {
        width: 200px;
        height: 20px;
        background: #e6e6e6;
        clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
        transition: background 0.3s ease;
        cursor: pointer;
      }

      .indicator.active {
        background: #222; /* Qora rang */
        cursor: default;
      }

    `
  ]
})
export class Banner {
  activeIndex = signal(0);

  slides = ['guarantee-original'] as const;
}
