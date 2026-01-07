import {afterNextRender, Component, computed, effect, ElementRef, inject, signal, viewChild, viewChildren} from '@angular/core';
import {ProductDetailStore} from '@/product/detail/services/product-detail-store';
import {ImageZoom} from '@/components/image-zoom/image-zoom';
import {TuiIcon} from '@taiga-ui/core';
import {IconComponent} from '@/components/icon/icon';
import { FavoritesService } from '@/services/favorites.service';

@Component({
  templateUrl: 'product-detail-images.html',
  styleUrl: 'product-detail-images.css',
  imports: [
    ImageZoom,
    TuiIcon,
    IconComponent
  ],
  selector: 'product-images'
})
export class ProductDetailImages {
  private readonly productDetailStore = inject(ProductDetailStore);
  private readonly favoritesService = inject(FavoritesService);

  thumbs = viewChildren<ElementRef>('thumb');
  mobileScrollContainer = viewChild<ElementRef<HTMLElement>>('mobileScrollContainer');
  mobileImages = viewChildren<ElementRef<HTMLImageElement>>('mobileImage');

  images = computed<string[]>(() => this.productDetailStore.detail().images);
  activeIndex = signal(0);
  isOpen = signal(false);
  isFavorite = signal(false);

  protected readonly disablePrevious = computed(() => this.activeIndex() === 0);
  protected readonly disableNext = computed(() => this.activeIndex() === this.images()?.length - 1);

  constructor() {
    afterNextRender(() => {
      setTimeout(() => {
        const container = this.mobileScrollContainer()?.nativeElement;
        if (container) {
          container.addEventListener('scroll', () => this.onMobileScroll());
        }
      }, 400);
    });

    effect(() => {
      if (this.productDetailStore.detail().id) {
        this.favoritesService.check(this.productDetailStore.detail().id).subscribe((res) => {
          this.isFavorite.set(res.is_favorite);
        });
      }
    });
  }

  clickFavor() {
    if (this.isFavorite()) {
      this.favoritesService.delete(this.productDetailStore.detail().id).subscribe(() => {
        this.isFavorite.set(false);
      });
    } else {
      this.favoritesService.add(this.productDetailStore.detail().id).subscribe(() => {
        this.isFavorite.set(true);
      });
    }
  }

  onMobileScroll() {
    const container = this.mobileScrollContainer()?.nativeElement;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
     // Each image takes full width (min-w-full)
    // Calculate which image is currently visible based on scroll position
    const currentIndex = Math.round(scrollLeft / containerWidth);
    const clampedIndex = Math.max(0, Math.min(currentIndex, (this.images()?.length || 1) - 1));

    if (this.activeIndex() !== clampedIndex) {
      this.activeIndex.set(clampedIndex);
    }
  }

  setActiveIndex(index: number) {
    this.activeIndex.set(index);
    this.scrollToActiveThumb();
    this.scrollToMobileImage(index);
  }

  previous() {
    this.activeIndex.update(index => index > 0 ? index - 1 : 0);
    this.scrollToActiveThumb();
    this.scrollToMobileImage(this.activeIndex());
  }

  next() {
    this.activeIndex.update(index => this.images()?.length > index ? index + 1 : 0);
    this.scrollToActiveThumb();
    this.scrollToMobileImage(this.activeIndex());
  }

  private scrollToActiveThumb() {
    const thumbs = this.thumbs();
    if (thumbs.length > 0) {
      const activeThumb = thumbs[this.activeIndex()]?.nativeElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      }
    }
  }

  private scrollToMobileImage(index: number) {
    const container = this.mobileScrollContainer()?.nativeElement;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const scrollPosition = index * containerWidth;
    container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
  }

  openModal() {
    this.isOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isOpen.set(false);
    document.body.style.overflow = '';
  }
}
