import {Component} from '@angular/core';
import {IconComponent} from '@/components/icon/icon';
import {CommentDetail} from '@/product/detail/components/comment/detail/comment-detail';

@Component({
  templateUrl: 'comment-list.html',
  selector: 'comment-list',
  imports: [
    IconComponent,
    CommentDetail
  ],
  host: {class: 'flex flex-col w-full justify-center gap-4'}
})
export class CommentList {

}
