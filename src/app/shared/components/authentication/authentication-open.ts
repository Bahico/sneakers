import {inject, Injectable} from '@angular/core';
import {TuiDialogService} from '@taiga-ui/core';
import {AuthenticationMain} from '@/components/authentication/authentication-main';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';

@Injectable({ providedIn: 'root'})
export class AuthenticationService {
  private readonly dialogs = inject(TuiDialogService);

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
