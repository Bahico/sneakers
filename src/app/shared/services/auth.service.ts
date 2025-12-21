import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint} from '@/get-endpoint';
import {TokenModel} from '@/models/token.model';

@Injectable({ providedIn: 'root'})
export class AuthService {
  private readonly http = inject(HttpClient);

  emailLogin(email: string) {
    return this.http.post<{email: string}>(getEndpoint('auth/request-code'), {}, {params: {email}})
  }

  sendCode(data: {email: string, code: string}) {
    return this.http.post<TokenModel>(getEndpoint('auth/verify-code'), data)
  }
}
