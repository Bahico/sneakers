import {HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {catchError, Observable, retry, throwError} from 'rxjs';
import {inject} from '@angular/core';
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
  console.log('aa')
  return next(req)
    .pipe(
      retry(1),
      catchError((err: HttpErrorResponse) => {
        console.log(err)
        if (err.status) {
          tokenService.update = null;
        }
        return throwError(() => new Error(err.error.message || 'Something went wrong'));
      })
    );
}
