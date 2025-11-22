import {Component, computed, ElementRef, inject, signal, viewChildren} from '@angular/core';
import {ProductDetailStore} from '@/product/detail/services/product-detail-store';
import {ImageZoom} from '@/components/image-zoom/image-zoom';
import {TuiIcon} from '@taiga-ui/core';


@Component({
  templateUrl: 'product-detail-images.html',
  imports: [
    ImageZoom,
    TuiIcon
  ],
  selector: 'product-images'
})
export class ProductDetailImages {
  private readonly productDetailStore = inject(ProductDetailStore);

  thumbs = viewChildren<ElementRef>('thumb');

  images = computed<string[]>(() => this.productDetailStore.detail().images);
  activeIndex = signal(0);

  protected readonly disablePrevious = computed(() => this.activeIndex() === 0);
  protected readonly disableNext = computed(() => this.activeIndex() === this.images()?.length - 1);

  setActiveIndex(index: number) {
    this.activeIndex.set(index);
    this.scrollToActiveThumb();
  }

  previous() {
    this.activeIndex.update(index => index > 0 ? index - 1 : 0);
    this.scrollToActiveThumb();
  }

  next() {
    this.activeIndex.update(index => this.images()?.length > index ? index + 1 : 0);
    this.scrollToActiveThumb();
  }

  private scrollToActiveThumb() {
    const activeThumb = this.thumbs()[this.activeIndex()].nativeElement;
    activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  }
}
