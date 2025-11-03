import {HttpInterceptorFn} from '@angular/common/http';
import tokenInterceptor from './token.interceptor';

export const interceptors: HttpInterceptorFn[] = [
  tokenInterceptor
];
