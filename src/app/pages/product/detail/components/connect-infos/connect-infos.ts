import {Component, inject, signal} from '@angular/core';
import {ProductDetailStore} from '@/product/detail/services/product-detail-store';
import {IconComponent} from '@/components/icon/icon';
import {CdkCopyToClipboard} from '@angular/cdk/clipboard';
import {NgOptimizedImage} from '@angular/common';
import {OriginalCertificateOpen} from '@/components/original-certificate/original-certificate-open';

@Component({
  templateUrl: 'connect-infos.html',
  selector: 'connect-infos',
  imports: [
    IconComponent,
    CdkCopyToClipboard,
    NgOptimizedImage
  ]
})
export class ConnectInfos {
  private readonly productDetailStore = inject(ProductDetailStore);
  private readonly originalCertificateOpen = inject(OriginalCertificateOpen);

  protected readonly detail = this.productDetailStore.detail;

  copySuccess = signal(false);
  openDescription = signal(false);
  openProperties = signal(false);

  copy() {
    this.copySuccess.set(true);
    setTimeout(() => {
      this.copySuccess.set(false);
    }, 3000);
  }

  openCertificate() {
    this.originalCertificateOpen.openModal();
  }
}
