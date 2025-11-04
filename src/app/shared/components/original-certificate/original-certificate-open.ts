import {inject, Injectable} from '@angular/core';
import {TuiDialogService} from '@taiga-ui/core';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {OriginalCertificate} from './original-certificate';

@Injectable({ providedIn: 'root'})
export class OriginalCertificateOpen {
  private readonly dialogs = inject(TuiDialogService);

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
