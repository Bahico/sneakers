import {inject, Injectable} from '@angular/core';
import {AuthenticationMain} from '@/components/authentication/authentication-main';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {DialogService} from '@/services/dialog.service';

@Injectable({ providedIn: 'root'})
export class AuthenticationOpen {
  private readonly dialogs = inject(DialogService);

  openModal(ref_code?: string) {
    this.dialogs
      .open(
        new PolymorpheusComponent(AuthenticationMain),
        {
          label: null,
          size: 'm',
          offset: 16,
          stops: ['29rem'],
          data: { ref_code }
        } as any,
      )
      .subscribe();
  }
}
