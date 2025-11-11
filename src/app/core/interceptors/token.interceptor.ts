import {HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
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

  return next(req)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        // Error response ni tekshirish
        console.log('Xato maʼlumotlari:', {
          status: error.status,
          statusText: error.statusText,
          url: req.url,
          headers: req.headers,
          errorBody: error.error,
          message: error.message
        });

        // 401 xatosini qayta ishlash
        if (error.status === 401) {
          tokenService.update = null;
        }

        // Xatoni qayta throw qilish
        return throwError(() => createHttpError(error));
      })
    );
}

function createHttpError(error: HttpErrorResponse): HttpErrorResponse {
  return new HttpErrorResponse({
    error: error.error,
    headers: error.headers,
    status: error.status,
    statusText: error.statusText,
    url: error.url || undefined,
  });
}
