import {Component, ElementRef, inject, OnDestroy, signal, viewChild} from '@angular/core';
import {IconComponent} from '@/components/icon/icon';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '@/services/auth.service';
import {OnlyNumber} from '@/directives/only-number';
import {TokenStore} from '@/token';
import {TokenModel} from '@/models/token.model';
import {injectContext} from '@taiga-ui/polymorpheus';
import {TuiDialogContext} from '@taiga-ui/core';
import {AccountStore} from '@/account';
import {CartService} from '@/services/cart.service';

export type TGUser = {
  id: number;
  username?: string;
  photo_url?: string;
  first_name: string;
  last_name?: string;
  auth_date: number;
  hash: string;
};

@Component({
  templateUrl: 'authentication-main.html',
  selector: 'authentication-main',
  imports: [
    IconComponent,
    ReactiveFormsModule,
    OnlyNumber,
    FormsModule
  ]
})
export class AuthenticationMain implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly accountStore = inject(AccountStore);
  private readonly tokenStore = inject(TokenStore);
  private readonly cartService = inject(CartService);
  protected readonly context = injectContext<TuiDialogContext<string, string>>();

  emailRef = viewChild<ElementRef<HTMLInputElement>>('emailRef');
  codeRef = viewChild<ElementRef<HTMLInputElement>>('codeRef'); 

  protected readonly email = new FormControl(null, [Validators.email, Validators.required]);
  protected readonly code = new FormControl(null, [Validators.minLength(6), Validators.maxLength(6), Validators.required]);

  visibleLogin = signal<boolean>(false);
  enterCode = signal(false);
  restOfTime = signal(30);
  errorCode = signal(false);
  isLoading = signal(false);

  interval: any;

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  changeType() {
    this.visibleLogin.set(true);
    setTimeout(() => {
      this.emailRef()?.nativeElement.focus();
    }, 100);
  }

  sendEmail() {
    this.isLoading.set(true);
    this.authService
      .emailLogin(this.email.value)
      .subscribe({
        next: () => {
          setTimeout(() => {
            this.codeRef()?.nativeElement.focus();
          }, 100);
          this.isLoading.set(false);
          this.enterCode.set(true);
          this.startCountDown();
        },
        error: err => {
          this.isLoading.set(false);
        }
      })
  }

  sendCode() {
    this.isLoading.set(true);
    this.authService
      .sendCode({email: this.email.value, code: this.code.value})
      .subscribe({
        next: (token: TokenModel) => {
          this.setToken(token);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.errorCode.set(true);
        }
      })
  }

  startCountDown() {
    this.interval = setInterval(() => {
      this.restOfTime.update(time => time - 1);
      if (this.restOfTime() === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  navigateTelegram(): void {
    this.authService
      .telegramLink()
      .subscribe(data => {
        const a = document.createElement('a');
        a.href = data.login_link;
        a.target = '_blank';
        a.click();
        this.interval = setInterval(() => {
          if (document.visibilityState !== 'hidden') {
            this.authService
              .checkSession(data.session_id)
              .subscribe(token => {
                this.setToken(token);
                clearInterval(this.interval);
              })
          }
        }, 100)
      })
  }

  setToken(token: TokenModel) {
    this.tokenStore.update = token;
    this.context.$implicit.complete();
    this.accountStore.getAccount().subscribe();
    this.cartService.loadCart().subscribe();
  }
}
