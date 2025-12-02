import {Component, inject} from '@angular/core';
import {AccountStore} from '@/account';
import {Router, RouterLink} from '@angular/router';

@Component({
  templateUrl: 'profile-menu.html',
  selector: 'profile-menu',
  imports: [
    RouterLink
  ],
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
