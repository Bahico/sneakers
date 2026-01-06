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
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
    const diffInMonths = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30));
    const diffInYears = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365));

    if (diffInSeconds < 60) return 'Только что';
    if (diffInMinutes < 60) {
      if (diffInMinutes === 1) return '1 минуту назад';
      if (diffInMinutes < 5) return `${diffInMinutes} минуты назад`;
      return `${diffInMinutes} минут назад`;
    }
    if (diffInHours < 24) {
      if (diffInHours === 1) return '1 час назад';
      if (diffInHours < 5) return `${diffInHours} часа назад`;
      return `${diffInHours} часов назад`;
    }
    if (diffInDays < 7) {
      if (diffInDays === 1) return '1 день назад';
      if (diffInDays < 5) return `${diffInDays} дня назад`;
      return `${diffInDays} дней назад`;
    }
    if (diffInWeeks < 4) {
      if (diffInWeeks === 1) return '1 неделю назад';
      if (diffInWeeks < 5) return `${diffInWeeks} недели назад`;
      return `${diffInWeeks} недель назад`;
    }
    if (diffInMonths < 12) {
      if (diffInMonths === 1) return '1 месяц назад';
      if (diffInMonths < 5) return `${diffInMonths} месяца назад`;
      return `${diffInMonths} месяцев назад`;
    }
    if (diffInYears === 1) return '1 год назад';
    if (diffInYears < 5) return `${diffInYears} года назад`;
    return `${diffInYears} лет назад`;
  });
}
