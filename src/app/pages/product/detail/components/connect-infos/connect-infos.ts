import {Component, inject} from '@angular/core';
import {ProductDetailStore} from '@/product/detail/services/product-detail-store';

@Component({
  templateUrl: 'connect-infos.html',
  selector: 'connect-infos',
})
export class ConnectInfos {
  private readonly productDetailStore = inject(ProductDetailStore);

  protected readonly detail = this.productDetailStore.detail;
}
