import {inject, Injectable} from '@angular/core';
import {environment} from 'environments';
import {HttpClient} from '@angular/common/http';
import {Observable, switchMap} from 'rxjs';
import {Cdek} from '@/models/cdek';

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type?: string;
}

@Injectable({providedIn: 'root'})
export class CdekService {
  private readonly http = inject(HttpClient);
  private readonly cdekUrl = `${environment.CDEK.API}/v2`;

  private token: string;
  private expiresIn: number;
  private tokenDate: Date;

  getDeliveryPointsByAddress(address: string): Observable<Cdek[]> {
    if (!this.token || this.isTokenExpired()) {
      return this.getToken()
        .pipe(
          switchMap(({access_token, expires_in}) => {
            this.token = access_token;
            this.expiresIn = expires_in;
            this.tokenDate = new Date();
            return this.getDeliveryPoints(address)
          })
        )
    }
    return this.getDeliveryPoints(address);
  }

  private isTokenExpired(): boolean {
    if (!this.token || !this.tokenDate || !this.expiresIn) {
      return true;
    }
    const now = new Date();
    const expirationTime = new Date(this.tokenDate.getTime() + this.expiresIn * 1000);
    // Add a 60 second buffer to refresh before actual expiration
    return now.getTime() >= (expirationTime.getTime() - 60000);
  }

  private getToken() {
    return this.http.post<TokenResponse>(`${this.cdekUrl}/oauth/token`, new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: environment.CDEK.CLIENT_ID,
      client_secret: environment.CDEK.CLIENT_SECRET
    }), {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
  }

  private getDeliveryPoints(address: string) {
    return this.http.get<Cdek[]>(`${this.cdekUrl}/deliverypoints`, {
      params: {country_code: 'RU', address},
      headers: this.token ? {Authorization: `Bearer ${this.token}`} : {}
    });
  }
}
