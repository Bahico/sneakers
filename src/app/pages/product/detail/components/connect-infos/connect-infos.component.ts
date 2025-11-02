import {Component, inject} from '@angular/core';
import {ProductDetailStore} from '@/product/detail/services/product-detail-store';

@Component({
  templateUrl: 'connect-infos.component.html',
  selector: 'connect-infos',
})
export class ConnectInfosComponent {
  private readonly productDetailStore = inject(ProductDetailStore);

  protected readonly detail = this.productDetailStore.detail;
}
