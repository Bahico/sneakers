import {Component, input} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {CategoryDetail} from '@/home/components/category/detail/category-detail';
import {Gender} from '@/home/home';

@Component({
  templateUrl: 'category-cloth.html',
  selector: 'category-cloth',
  imports: [
    NgOptimizedImage,
    CategoryDetail
  ]
})
export class CategoryCloth {
  gender = input.required<Gender>();
}
