import {Component, computed, ElementRef, signal, viewChild} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { IconComponent } from '@/components/icon/icon';
import { TuiBreadcrumbs } from '@taiga-ui/kit';
import { TuiItem } from '@taiga-ui/cdk';
import { TuiLink } from '@taiga-ui/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'reviews-information',
  templateUrl: 'reviews-information.html',
  host: {class: 'flex w-full justify-center pb-10'},
  imports: [
    NgOptimizedImage,
    IconComponent,
    TuiBreadcrumbs,
    TuiItem,
    TuiLink,
    RouterLink
  ]
})
export default class ReviewsInformation {
  scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  scrolling = signal(0);

  previous() {
    const container = this.scrollContainer()?.nativeElement;
    this.scrolling.update(current => current != 0 ? current - 1 : 0);
    if (container) {
      container.scrollBy({ left: -350, behavior: 'smooth' });
    }
  }

  next() {
    const container = this.scrollContainer()?.nativeElement;
    this.scrolling.update(current => current != 4 ? current + 1 : 4);
    if (container) {
      container.scrollBy({ left: 350, behavior: 'smooth' });
    }
  }
}
