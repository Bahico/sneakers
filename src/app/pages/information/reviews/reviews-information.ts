import {afterNextRender, Component, computed, ElementRef, signal, viewChild} from '@angular/core';
import {NgClass, NgOptimizedImage} from '@angular/common';
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
    RouterLink,
    NgClass
  ]
})
export default class ReviewsInformation {
  scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  scrolling = signal(0);

  scrollSize = signal(350);

  centeredIndices = signal<number[]>([1, 2]);

  constructor() {
    afterNextRender(() => {
      if (window.innerWidth < 768) {
        this.scrollSize.set(280);
      }
      
      const container = this.scrollContainer()?.nativeElement;
      if (container) {
        container.addEventListener('scroll', () => this.onScroll());
        // Initial calculation
        this.onScroll();
      }
    })
  }

  onScroll() {
    const container = this.scrollContainer()?.nativeElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    const children = Array.from(container.children) as HTMLElement[];
    
    const distances = children.map((child, index) => {
      const childRect = child.getBoundingClientRect();
      const childCenter = childRect.left + childRect.width / 2;
      return {
        index,
        distance: Math.abs(containerCenter - childCenter)
      };
    });

    // Sort by distance and get the two closest items
    const closest = distances
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2)
      .map(item => item.index);

    this.centeredIndices.set(closest);
  }

  isCentered(index: number): boolean {
    return this.centeredIndices().includes(index);
  }

  getItemClass(index: number): string {
    const baseClass = 'w-full transition-all duration-300';
    const widthClass = this.isCentered(index) ? 'md:w-80' : 'md:w-70';
    return `${baseClass} ${widthClass}`;
  }

  previous() {
    const container = this.scrollContainer()?.nativeElement;
    this.scrolling.update(current => current != 0 ? current - 1 : 0);
    if (container) {
      container.scrollBy({ left: this.scrollSize() * -1, behavior: 'smooth' });
      // Recalculate after scroll animation
      setTimeout(() => this.onScroll(), 300);
    }
  }

  next() {
    const container = this.scrollContainer()?.nativeElement;
    this.scrolling.update(current => current != 4 ? current + 1 : 4);
    if (container) {
      container.scrollBy({ left: this.scrollSize(), behavior: 'smooth' });
      // Recalculate after scroll animation
      setTimeout(() => this.onScroll(), 300);
    }
  }
}
