import {afterNextRender, Component, inject} from '@angular/core';
import {AccountStore} from '@/account';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '@/services/auth.service';

@Component({
  templateUrl: 'profile-menu.html',
  styleUrl: 'profile-menu.css',
  selector: 'profile-menu',
  imports: [
    RouterLink
  ],
})
export class ProfileMenu {
  private readonly account = inject(AccountStore);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  coins = this.authService.coins;

  constructor() {
    afterNextRender(() => {
      this.loadCoins();
    })
  }

  logout() {
    this.account.logout();
    this.router.navigate(['/']);
  }

  loadCoins() {
    this.authService.getCoins()
  }
}
