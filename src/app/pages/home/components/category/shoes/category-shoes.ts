import {Component} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {CategoryDetail} from '@/home/components/category/detail/category-detail';

@Component({
  templateUrl: 'category-shoes.html',
  selector: 'category-shoes',
  imports: [
    NgOptimizedImage,
    CategoryDetail
  ]
})
export class CategoryShoes {

}
