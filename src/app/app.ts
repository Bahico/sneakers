import { Component, inject, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import Navbar from './layout/navbar/navbar';
import Footer from './layout/footer/footer';
import { TuiRoot } from '@taiga-ui/core';
import { TokenStore } from '@/token';
import { AuthenticationOpen } from '@/components/authentication/authentication-open';
import { ReferralsService } from '@/services/referrals.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, TuiRoot],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  encapsulation: ViewEncapsulation.None
})
export class App {
  private readonly tokenStore = inject(TokenStore);
  private readonly route = inject(ActivatedRoute);
  private readonly authenticationOpen = inject(AuthenticationOpen);
  private readonly referralsService = inject(ReferralsService);

  constructor() {
    this.route.queryParams.subscribe(params => {
      const ref_code = params['ref_code'];
      if (ref_code && !this.tokenStore.token()?.access_token) {
        this.referralsService.trackClick(ref_code).subscribe({
          next: () => {
            this.authenticationOpen.openModal(ref_code);
          }
        });
      }
    });
  }
}
