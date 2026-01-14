import {inject, Injectable} from '@angular/core';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {OriginalCertificate} from './original-certificate';
import {DialogService} from '@/services/dialog.service';

@Injectable({ providedIn: 'root'})
export class OriginalCertificateOpen {
  private readonly dialogs = inject(DialogService);

  openModal() {
    this.dialogs
      .open(
        new PolymorpheusComponent(OriginalCertificate),
        {
          label: null,
          size: 'l'
        },
      )
      .subscribe();
  }
}
