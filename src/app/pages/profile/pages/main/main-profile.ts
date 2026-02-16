import {afterNextRender, Component, computed, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TuiBreadcrumbs} from '@taiga-ui/kit';
import {TuiLink} from '@taiga-ui/core';
import {TuiItem} from '@taiga-ui/cdk';
import {ProfileMenu} from '@/profile/components/menu/profile-menu';
import {AccountStore} from '@/account';
import {Account} from '@/models/account';

@Component({
  templateUrl: 'main-profile.html',
  selector: 'main-profile',
  host: {class: 'flex w-full justify-center pb-10'},
  imports: [
    RouterLink,
    TuiBreadcrumbs,
    TuiLink,
    TuiItem,
    ProfileMenu
  ]
})
export default class MainProfile {
  private readonly accountStore = inject(AccountStore);

  readonly account = this.accountStore.account;

  readonly extendedAccount = computed(() => this.account() as (Account & { phone?: string }));

  constructor() {
    afterNextRender(() => {
      if (!this.account()) {
        this.accountStore.getAccount().subscribe();
      }
    });
  }

  get initials(): string {
    const account = this.extendedAccount();
    if (!account) {
      return '';
    }

    const first = account.first_name?.[0] ?? '';
    const last = account.last_name?.[0] ?? '';

    return (first + last).toUpperCase();
  }

  get fullName(): string {
    const account = this.extendedAccount();
    if (!account) {
      return '';
    }

    return [account.first_name, account.last_name].filter(Boolean).join(' ');
  }

  get telegramHandle(): string {
    const account = this.extendedAccount();
    if (!account?.telegram_id) {
      return '';
    }

    return `@${account.telegram_id.replace(/^@/, '')}`;
  }

  get phone(): string {
    const account = this.extendedAccount();
    return account?.phone ?? '';
  }
}
