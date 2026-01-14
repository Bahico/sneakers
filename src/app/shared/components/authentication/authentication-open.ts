import {inject, Injectable} from '@angular/core';
import {AuthenticationMain} from '@/components/authentication/authentication-main';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {DialogService} from '@/services/dialog.service';

@Injectable({ providedIn: 'root'})
export class AuthenticationOpen {
  private readonly dialogs = inject(DialogService);

  openModal() {
    this.dialogs
      .open(
        new PolymorpheusComponent(AuthenticationMain),
        {
          label: null,
          size: 'm'
        },
      )
      .subscribe();
  }
}
