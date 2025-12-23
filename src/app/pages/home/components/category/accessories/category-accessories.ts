import {Component, inject} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {CategoryDetail} from '@/home/components/category/detail/category-detail';
import {HomeStore} from '@/home.store';
import {RouterLink} from '@angular/router';

@Component({
  templateUrl: 'category-accessories.html',
  imports: [
    NgOptimizedImage,
    CategoryDetail,
    RouterLink
  ],
  selector: 'category-accessories'
})
export class CategoryAccessories {
  private readonly homeStore = inject(HomeStore);

  protected readonly gender = this.homeStore.gender;
}
