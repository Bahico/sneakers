import {Component} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {CategoryDetail} from '@/home/components/category/detail/category-detail';

@Component({
  templateUrl: 'category-accessories.html',
  imports: [
    NgOptimizedImage,
    CategoryDetail
  ],
  selector: 'category-accessories'
})
export class CategoryAccessories {

}
