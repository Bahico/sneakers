import { MeetTeam } from '@/home/components/banner/meet-team/meet-team';
import { BannerRealRate } from '@/home/components/banner/real-rate/banner-real-rate';
import { BannerSplit } from '@/home/components/banner/split/banner-split';
import { BannerTelegram } from '@/home/components/banner/telegram/banner-telegram';
import { BannerService } from '@/services/banner.service';
import { Component, inject, signal } from "@angular/core";
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { GuaranteeOriginal } from './guarantee-original/guarantee-original';

@Component({
  templateUrl: 'banner.html',
  selector: 'banner',
  imports: [
    GuaranteeOriginal,
    MeetTeam,
    BannerRealRate,
    BannerSplit,
    BannerTelegram
  ],
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
