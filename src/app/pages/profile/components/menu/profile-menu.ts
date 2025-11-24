import {Component, inject} from '@angular/core';
import {AccountStore} from '@/account';
import {Router} from '@angular/router';

@Component({
  templateUrl: 'profile-menu.html',
  selector: 'profile-menu',
  styleUrl: 'profile-menu.css'
})
export class ProfileMenu {
  private readonly account = inject(AccountStore);
  private readonly router = inject(Router);

  logout() {
    this.account.logout();
    this.router.navigate(['/']);
  }
}
