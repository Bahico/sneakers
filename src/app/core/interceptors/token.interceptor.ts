import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { inject } from '@angular/core';
import {TokenStore} from '@/token';

export default function (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const tokenService = inject(TokenStore);

  if (tokenService.token()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${tokenService.token().access}`
      },
    })
  }

  return next(req);
}
