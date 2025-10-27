import {Component, computed, ElementRef, signal, viewChildren} from '@angular/core';
import {getImageUrl} from '@/get-endpoint';

@Component({
  templateUrl: 'product-detail-images.component.html',
  selector: 'product-images',
})
export class ProductDetailImagesComponent {
  protected readonly getImageUrl = getImageUrl;

  thumbs = viewChildren<ElementRef>('thumb');

  images = signal<string[]>([
    "images/product/b641d56d7ad792aec554525f33ccc89c072065f1.png",
    "images/product/Frame 1000001172.png",
    "images/product/b641d56d7ad792aec554525f33ccc89c072065f1.png",
    "images/product/Frame 1000001172.png",
    "images/product/b641d56d7ad792aec554525f33ccc89c072065f1.png",
    "images/product/Frame 1000001172.png",
    "images/product/b641d56d7ad792aec554525f33ccc89c072065f1.png",
    "images/product/Frame 1000001172.png",
    "images/product/b641d56d7ad792aec554525f33ccc89c072065f1.png",
    "images/product/Frame 1000001172.png",
  ]);
  activeIndex = signal(0);

  protected readonly disablePrevious = computed(() => this.activeIndex() === 0);
  protected readonly disableNext = computed(() => this.activeIndex() === this.images().length - 1);

  setActiveIndex(index: number) {
    this.activeIndex.set(index);
    this.scrollToActiveThumb();
  }

  previous() {
    this.activeIndex.update(index => index > 0 ? index - 1 : 0);
    this.scrollToActiveThumb();
  }

  next() {
    this.activeIndex.update(index => this.images().length > index ? index + 1 : 0);
    this.scrollToActiveThumb();
  }

  private scrollToActiveThumb() {
    const activeThumb = this.thumbs()[this.activeIndex()].nativeElement;
    activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  }
}
