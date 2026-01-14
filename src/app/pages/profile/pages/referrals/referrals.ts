import {ReferralsService} from '@/services/referrals.service';
import {Component, DestroyRef, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TuiBreadcrumbs} from '@taiga-ui/kit';
import {TuiFormatNumberPipe, TuiLink} from '@taiga-ui/core';
import {TuiTable} from '@taiga-ui/addon-table';
import {ProfileMenu} from '@/profile/components/menu/profile-menu';
import {ReferralLink} from '@/models/referral';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {catchError, of} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {CdkCopyToClipboard} from '@angular/cdk/clipboard';
import {IconComponent} from '@/components/icon/icon';
import {TuiItem} from '@taiga-ui/cdk';
import {DialogService} from '@/services/dialog.service';
import {ReferralCreate} from '@/profile/pages/referrals/create/referral-create';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';

@Component({
  templateUrl: 'referrals.html',
  selector: 'referrals',
  host: {class: 'flex w-full justify-center pb-10'},
  imports: [
    RouterLink,
    TuiBreadcrumbs,
    TuiFormatNumberPipe, TuiTable,
    ProfileMenu,
    FormsModule,
    ReactiveFormsModule, AsyncPipe, CdkCopyToClipboard, IconComponent, TuiItem, TuiLink
  ]
})
export default class Referrals {
  protected readonly referralsService = inject(ReferralsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogs = inject(DialogService);

  loading = signal(false);
  links = signal<ReferralLink[]>([]);
  myLink = signal<ReferralLink | null>(null);
  copySuccess = signal<string | null>(null);

  protected readonly columns: (keyof ReferralLink)[] = ['name', 'code', 'clicks', 'unique_clients', 'orders', 'conversion_rate', 'total_revenue'];

  constructor() {
    this.loadReferralLinks();
    this.loadMyLink();
  }

  loadReferralLinks() {
    this.loading.set(true);
    this.referralsService.myLinks()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => {
          this.loading.set(false);
          return of([]);
        })
      )
      .subscribe(links => {
        this.links.set(links);
        this.loading.set(false);
      });
  }

  loadMyLink() {
    this.referralsService.myLink()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => of(null))
      )
      .subscribe(link => {
        this.myLink.set(link);
      });
  }

  copyLink(linkId: string) {
    this.copySuccess.set(linkId);
    setTimeout(() => {
      this.copySuccess.set(null);
    }, 3000);
  }

  openCreateDialog() {
    const dialog = this.dialogs.open(new PolymorpheusComponent(ReferralCreate), {
      label: null,
      size: 'm',
    });
    dialog.subscribe(() => this.loadReferralLinks())
  }
}
