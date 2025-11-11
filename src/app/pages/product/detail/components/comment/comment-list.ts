import {Component} from '@angular/core';
import {TuiAvatar} from '@taiga-ui/kit';
import {IconComponent} from '@/components/icon/icon';

@Component({
  templateUrl: 'comment-list.html',
  selector: 'comment-list',
  imports: [
    TuiAvatar,
    IconComponent
  ],
  host: {class: 'flex flex-col w-full justify-center gap-4'}
})
export class CommentList {

}
