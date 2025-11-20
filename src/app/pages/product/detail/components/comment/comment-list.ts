import {Component, inject} from '@angular/core';
import {IconComponent} from '@/components/icon/icon';
import {CommentDetail} from '@/product/detail/components/comment/detail/comment-detail';
import {ProductDetailStore} from '@/product/detail/services/product-detail-store';

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

  protected readonly detail = this.productDetailStore.detail;
}
