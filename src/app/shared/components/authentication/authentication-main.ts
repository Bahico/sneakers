import {afterNextRender, Component, ElementRef, inject, signal, ViewChild, viewChild} from '@angular/core';
import {AuthenticationType} from './authentication.type';
import {IconComponent} from '@/components/icon/icon';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
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
    OnlyNumber
  ]
})
export class AuthenticationMain {
  private readonly authService = inject(AuthService);
  private readonly accountStore = inject(AccountStore);
  private readonly tokenStore = inject(TokenStore);
  private readonly cartService = inject(CartService);
  protected readonly context = injectContext<TuiDialogContext<string, string>>();


  @ViewChild('telegramBtnRef') myDivElement!: ElementRef;

  protected readonly email = new FormControl(null, [Validators.email, Validators.required]);
  protected readonly code = new FormControl(null, [Validators.minLength(6), Validators.maxLength(6), Validators.required]);

  loginType = signal<AuthenticationType | null>(null);
  enterCode = signal(false);
  restOfTime = signal(30);
  errorCode = signal(false);

  constructor() {
    afterNextRender(() => {
      setTimeout(() => {
        this.loginTelegram()
      }, 1000)
    })
  }

  changeType(type: AuthenticationType) {
    this.loginType.set(type);
  }

  sendEmail() {
    this.authService
      .emailLogin(this.email.value)
      .subscribe(() => {
        this.enterCode.set(true);
        this.startCountDown();
      })
  }

  sendCode() {
    this.authService
      .sendCode({email: this.email.value, code: this.code.value})
      .subscribe({
        next: (token: TokenModel) => {
          this.tokenStore.update = token;
          this.context.$implicit.complete();
          this.accountStore.getAccount().subscribe();
          this.cartService.loadCart();
        },
        error: () => {
          this.errorCode.set(true);
        }
      })
  }

  startCountDown() {
    const interval = setInterval(() => {
      this.restOfTime.update(time => time - 1);
      if (this.restOfTime() === 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  loginTelegram() {
    (window as any).TelegramOnAuthCb = (user: TGUser) => console.log(user);


    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;

    script.setAttribute('data-telegram-login', 'sneaker_team_bot');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-onauth', 'TelegramOnAuthCb(user)');
    script.setAttribute('data-lang', 'ru');

    this.myDivElement.nativeElement.appendChild(script);
  }
}
