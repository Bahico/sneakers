import {Component} from '@angular/core';
import {IconComponent} from '@/components/icon/icon';
import {NgOptimizedImage} from '@angular/common';

@Component({
  templateUrl: 'comment-detail.html',
  selector: 'comment-detail',
  host: {class: 'pb-6'},
  imports: [
    IconComponent,
    NgOptimizedImage
  ]
})
export class CommentDetail {}
