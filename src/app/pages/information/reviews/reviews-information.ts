import {Component} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
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
    RouterLink
  ]
})
export default class ReviewsInformation {

}