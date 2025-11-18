import {Component} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {CategoryDetail} from '@/home/components/category/detail/category-detail';

@Component({
  templateUrl: 'category-cloth.html',
  selector: 'category-cloth',
  imports: [
    NgOptimizedImage,
    CategoryDetail
  ]
})
export class CategoryCloth {

}
