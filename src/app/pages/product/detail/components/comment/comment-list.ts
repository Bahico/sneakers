import {afterNextRender, Component, computed, effect, inject, signal} from '@angular/core';
import {CommentDetail} from '@/product/detail/components/comment/detail/comment-detail';
import {ProductDetailStore} from '@/product/detail/services/product-detail-store';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {Feedback} from '@/product/detail/components/feedback/feedback';
import {TuiDialogService} from '@taiga-ui/core';
import {CommentService} from '@/services/comment.service';
import {Comment} from '@/models/comment';
import {catchError, of} from 'rxjs';
import {IconComponent} from '@/components/icon/icon';

@Component({
  templateUrl: 'comment-list.html',
  selector: 'comment-list',
  imports: [
    CommentDetail,
    IconComponent
  ],
  host: {class: 'flex flex-col w-full justify-center gap-4'}
})
export class CommentList {
  private readonly productDetailStore = inject(ProductDetailStore);
  private readonly dialogs = inject(TuiDialogService);
  private readonly commentService = inject(CommentService);

  protected readonly detail = this.productDetailStore.detail;
  protected readonly comments = signal<Comment[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly averageRating = computed(() => {
    const comments = this.comments();
    if (comments.length === 0) return 0;
    const sum = comments.reduce((acc, comment) => acc + comment.rating, 0);
    return sum / comments.length;
  });

  protected readonly roundedRating = computed(() => {
    return Math.round(this.averageRating());
  });

  protected readonly totalComments = computed(() => this.comments().length);

  protected readonly starsArray = computed(() => Array.from({length: 5}));

  protected isStarFilled(index: number): boolean {
    return index < this.roundedRating();
  }

  constructor() {
    effect(() => {
      if (this.detail()) {
        this.loadComments();
      }
    });
  }

  private loadComments() {
    if (!this.detail()?.id) return;

    this.loading.set(true);
    this.error.set(null);

    this.commentService
      .getComments(this.detail().id, {limit: 4, offset: 0})
      .pipe(
        catchError(err => {
          this.error.set(err.message || 'Failed to load comments');
          this.loading.set(false);
          return of({reviews: [], stats: {total_reviews: 0, total_ratings: 0, average_rating: 0, rating_distribution: {}}});
        })
      )
      .subscribe(result => {
        this.comments.set(result.reviews);
        this.loading.set(false);
      });
  }

  openFeedback() {
    this.dialogs
      .open(
        new PolymorpheusComponent(Feedback),
        {
          label: null,
          size: 'l'
        },
      )
      .subscribe(() => {
        // Reload comments after feedback is submitted
        this.loadComments();
      });
  }
}
