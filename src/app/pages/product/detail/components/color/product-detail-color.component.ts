import {Component, ElementRef, signal, viewChildren} from '@angular/core';
import {getImageUrl} from '@/get-endpoint';
import {NgClass} from '@angular/common';

@Component({
  templateUrl: 'product-detail-color.component.html',
  selector: 'product-detail-color',
  imports: [
    NgClass
  ]
})
export class ProductDetailColorComponent {
  protected readonly getImageUrl = getImageUrl;

  thumbs = viewChildren<ElementRef>('thumb');

  activeIndex = signal(0);
  colors = signal([
    "images/product/b641d56d7ad792aec554525f33ccc89c072065f1.png",
    "images/product/Item → Label.png",
    "images/product/b641d56d7ad792aec554525f33ccc89c072065f1.png",
    "images/product/Item → Label.png",
    "images/product/b641d56d7ad792aec554525f33ccc89c072065f1.png",
    "images/product/Item → Label.png",
  ]);

  setActiveIndex(index: number) {
    this.activeIndex.set(index);
    this.scrollToActiveThumb();
  }

  private scrollToActiveThumb() {
    const activeThumb = this.thumbs()[this.activeIndex()].nativeElement;
    activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  }
}
