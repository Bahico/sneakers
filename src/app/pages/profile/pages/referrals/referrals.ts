import {ReferralsService} from '@/services/referrals.service';
import {Component, computed, DestroyRef, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TuiBreadcrumbs} from '@taiga-ui/kit';
import {TuiFormatNumberPipe} from '@taiga-ui/core';
import {TuiTable} from '@taiga-ui/addon-table';
import {ProfileMenu} from '@/profile/components/menu/profile-menu';
import {ReferralLink} from '@/models/referral';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {catchError, of} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {CdkCopyToClipboard} from '@angular/cdk/clipboard';
import {IconComponent} from '@/components/icon/icon';

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
    ReactiveFormsModule, AsyncPipe, CdkCopyToClipboard, IconComponent
  ]
})
export default class Referrals {
  protected readonly referralsService = inject(ReferralsService);
  private readonly destroyRef = inject(DestroyRef);

  loading = signal(false);
  links = signal<ReferralLink[]>([]);
  myLink = signal<ReferralLink | null>(null);
  showGenerateForm = signal(false);
  copySuccess = signal<string | null>(null);

  protected readonly columns: (keyof ReferralLink)[] = ['name', 'code', 'clicks', 'unique_clients', 'orders', 'conversion_rate', 'total_revenue'];

  generateForm = new FormGroup({
    name: new FormControl<string>(''),
    code: new FormControl<string>('')
  });

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

  generateLink() {
    const {name, code} = this.generateForm.value;
    if (!name || !code) return;

    this.loading.set(true);
    this.referralsService.generateLink({name, code})
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => {
          this.loading.set(false);
          return of(null);
        })
      )
      .subscribe(link => {
        if (link) {
          this.links.update(links => [link, ...links]);
          this.generateForm.reset();
          this.showGenerateForm.set(false);
        }
        this.loading.set(false);
      });
  }

  copyLink(linkId: string) {
    this.copySuccess.set(linkId);
    setTimeout(() => {
      this.copySuccess.set(null);
    }, 3000);
  }

  toggleGenerateForm() {
    this.showGenerateForm.update(val => !val);
  }

  protected formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}
