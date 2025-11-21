import {Component, input} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {CategoryDetail} from '@/home/components/category/detail/category-detail';
import {Gender} from '@/home/home';

@Component({
  templateUrl: 'category-shoes.html',
  selector: 'category-shoes',
  imports: [
    NgOptimizedImage,
    CategoryDetail
  ]
})
export class CategoryShoes {
  gender = input.required<Gender>();
}
