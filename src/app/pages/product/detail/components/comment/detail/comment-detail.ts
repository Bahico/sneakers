import {Component, computed, input} from '@angular/core';
import {IconComponent} from '@/components/icon/icon';
import {Comment} from '@/models/comment';

@Component({
  templateUrl: 'comment-detail.html',
  selector: 'comment-detail',
  host: {class: 'pb-6'},
  imports: [
    IconComponent
  ]
})
export class CommentDetail {
  comment = input<Comment>();

  protected readonly stars = computed(() => {
    const rating = this.comment()?.rating || 0;
    return Array.from({length: 5}, (_, i) => i < rating);
  });

  protected readonly timeAgo = computed(() => {
    const createdAt = this.comment()?.created_at;
    if (!createdAt) return '';

    const date = new Date(createdAt);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMonths = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30));

    if (diffInMonths === 0) return 'Недавно';
    if (diffInMonths === 1) return '1 месяц назад';
    if (diffInMonths < 5) return `${diffInMonths} месяца назад`;
    return `${diffInMonths} месяцев назад`;
  });
}
