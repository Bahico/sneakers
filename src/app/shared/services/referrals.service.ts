import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getEndpoint } from '@/get-endpoint';
import { ReferralLink, ReferralStats } from '@/models/referral';

@Injectable({ providedIn: 'root' })
export class ReferralsService {
  private readonly http = inject(HttpClient);

  private readonly endpoint = getEndpoint('referrals');

  myLink() {
    return this.http.get<ReferralLink>(`${this.endpoint}/my-link`);
  }

  myLinks() {
    return this.http.get<ReferralLink[]>(`${this.endpoint}/my-links`);
  }

  generateLink(payload: { name: string }) {
    return this.http.post<ReferralLink>(`${this.endpoint}/generate`, payload);
  }
}
