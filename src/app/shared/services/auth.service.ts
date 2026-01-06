import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint} from '@/get-endpoint';
import {TokenModel} from '@/models/token.model';
import {PassportData, UpdateUserProfileDto} from '@/models/passport';
import {Observable, tap} from 'rxjs';
import { TokenStore } from '@/token';

@Injectable({ providedIn: 'root'})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStore = inject(TokenStore);
  
  emailLogin(email: string) {
    return this.http.post<{email: string}>(getEndpoint('auth/request-code'), {}, {params: {email}})
  }

  sendCode(data: {email: string, code: string}) {
    return this.http.post<TokenModel>(getEndpoint('auth/verify-code'), data)
  }

  refresh() {
    return this.http.post<TokenModel>(getEndpoint('auth/refresh'), {})
      .pipe(
        tap(res => {
          this.tokenStore.update = res;
        })
      )
  }

  updateUserProfile(data: UpdateUserProfileDto) {
    return this.http.put(getEndpoint('auth/profile/update'), data);
  }

  createPassportData(data: PassportData) {
    return this.http.post(getEndpoint('auth/passport/create'), data);
  }

  updatePassportData(data: PassportData) {
    return this.http.patch(getEndpoint('auth/passport/update'), data);
  }

  getPassportData(): Observable<PassportData> {
    return this.http.get<PassportData>(getEndpoint('auth/passport/me'));
  }
}
