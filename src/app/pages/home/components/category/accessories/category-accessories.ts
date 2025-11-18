import {Component} from '@angular/core';
import {CategoryDetail} from '@/home/components/category/detail/category-detail';
import {NgOptimizedImage} from '@angular/common';

@Component({
  templateUrl: 'category-accessories.html',
  imports: [
    CategoryDetail,
    NgOptimizedImage
  ],
  selector: 'category-accessories'
})
export class CategoryAccessories {

}
