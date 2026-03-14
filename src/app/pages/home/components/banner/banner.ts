import {Component, computed, signal} from "@angular/core";
import {GuaranteeOriginal} from './guarantee-original/guarantee-original';
import {MeetTeam} from '@/home/components/banner/meet-team/meet-team';
import {BannerRealRate} from '@/home/components/banner/real-rate/banner-real-rate';
import {BannerSplit} from '@/home/components/banner/split/banner-split';
import {BannerTelegram} from '@/home/components/banner/telegram/banner-telegram';

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
  activeIndex = signal(0);

  slides = ['meet-team', 'split', 'guarantee-original', 'telegram', 'real-rate'] as const;

  protected readonly disablePrevious = computed(() => this.activeIndex() === 0);
  protected readonly disableNext = computed(() => this.activeIndex() === this.slides.length - 1);

  previous() {
    this.activeIndex.update(index => index > 0 ? index - 1 : this.slides.length - 1);
  }

  next() {
    this.activeIndex.update(index => index < this.slides.length - 1 ? index + 1 : 0);
  }
}
