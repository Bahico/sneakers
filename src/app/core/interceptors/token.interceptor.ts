import {HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {catchError, Observable, throwError, switchMap} from 'rxjs';
import {inject} from '@angular/core';
import {TokenStore} from '@/token';
import {environment} from 'environments';
import {AuthService} from '@/services/auth.service';

const RETRY_HEADER = 'X-Refresh-Attempt';

export default function (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const tokenService = inject(TokenStore);
  const authService = inject(AuthService);

  const currentToken = tokenService.token();

  if (currentToken && !req.url.includes(environment.CDEK.API)) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${currentToken.access_token}`
      },
    });
  }

  return next(req)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        // Non-auth errors: just rethrow
        if (error.status !== 401) {
          return throwError(() => createHttpError(error));
        }

        // If this request is already a retry or is the refresh call itself,
        // treat this 401 as final: logout and propagate error.
        if (req.headers.has(RETRY_HEADER) || req.url.includes('auth/refresh')) {
          tokenService.update = null;
          return throwError(() => createHttpError(error));
        }

        // First 401: try to refresh token
        return authService.refresh().pipe(
          switchMap(() => {
            const updatedToken = tokenService.token();

            if (!updatedToken) {
              tokenService.update = null;
              return throwError(() => createHttpError(error));
            }

            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${updatedToken.access_token}`,
                [RETRY_HEADER]: 'true'
              },
            });

            return next(retryReq);
          }),
          catchError((refreshError: unknown) => {
            // Refresh failed (including 401) -> logout and propagate.
            tokenService.update = null;

            const httpError = refreshError instanceof HttpErrorResponse
              ? refreshError
              : error;

            return throwError(() => createHttpError(httpError));
          })
        );
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
