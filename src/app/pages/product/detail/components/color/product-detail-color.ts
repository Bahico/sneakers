import {Component, computed, ElementRef, inject, signal, viewChildren} from '@angular/core';
import {getImageUrl} from '@/get-endpoint';
import {NgClass} from '@angular/common';
import {ProductModel} from '@/models/product.model';
import {ProductDetailStore} from '@/product/detail/services/product-detail-store';

@Component({
  templateUrl: 'product-detail-color.html',
  selector: 'product-detail-color',
  imports: [
    NgClass
  ]
})
export class ProductDetailColor {
  private readonly productDetailStore = inject(ProductDetailStore);

  thumbs = viewChildren<ElementRef>('thumb');

  activeIndex = signal(0);
  colors = computed(() => this.productDetailStore.similar().slice(0, 8));

  protected readonly disablePrevious = computed(() => this.activeIndex() === 0);
  protected readonly disableNext = computed(() => this.activeIndex() === this.colors().length - 1);

  setActiveIndex(index: number) {
    this.activeIndex.set(index);
    this.scrollToActiveThumb();
  }

  previous(): void {
    this.activeIndex.update(index => index > 0 ? index - 1 : 0);
    this.scrollToActiveThumb();
  }

  next(): void {
    this.activeIndex.update(index => this.colors().length > index ? index + 1 : 0);
    this.scrollToActiveThumb();
  }

  private scrollToActiveThumb() {
    const activeThumb = this.thumbs()[this.activeIndex()].nativeElement;
    activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  }
}
