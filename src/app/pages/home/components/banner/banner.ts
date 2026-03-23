import {BannerService} from '@/services/banner.service';
import {Component, inject, signal} from "@angular/core";
import {rxResource} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';

@Component({
  templateUrl: 'banner.html',
  selector: 'banner',
  imports: [],
  styles: [
    `
      .slider-wrapper {
        width: 100%;
        overflow: hidden;
      }
    `
  ]
})
export class Banner {
  private readonly bannerService = inject(BannerService);

  activeIndex = signal(0);

  protected readonly banners = rxResource({
    stream: () => this.bannerService.banners().pipe(map(banners => {
      banners.top_banners = banners.top_banners.sort((a, b) => a.order - b.order);
      return banners;
    })),
  })
  // slides = ['meet-team', 'split', 'guarantee-original', 'telegram', 'real-rate'] as const;
}
