import {Component, inject} from '@angular/core';
import {IconComponent} from '@/components/icon/icon';
import {CommentDetail} from '@/product/detail/components/comment/detail/comment-detail';
import {ProductDetailStore} from '@/product/detail/services/product-detail-store';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {Feedback} from '@/product/detail/components/feedback/feedback';
import {TuiDialogService} from '@taiga-ui/core';

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
  private readonly productDetailStore = inject(ProductDetailStore);
  private readonly dialogs = inject(TuiDialogService);

  protected readonly detail = this.productDetailStore.detail;

  openFeedback() {
    this.dialogs
      .open(
        new PolymorpheusComponent(Feedback),
        {
          label: null,
          size: 'l'
        },
      )
      .subscribe();
  }
}
