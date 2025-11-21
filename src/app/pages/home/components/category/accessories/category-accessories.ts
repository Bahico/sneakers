import {Component, input} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {CategoryDetail} from '@/home/components/category/detail/category-detail';
import {Gender} from '@/home/home';

@Component({
  templateUrl: 'category-accessories.html',
  imports: [
    NgOptimizedImage,
    CategoryDetail
  ],
  selector: 'category-accessories'
})
export class CategoryAccessories {
  gender = input.required<Gender>();

}
