import { ApplicationConfig } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiKeyInterceptor } from './interceptors/api-key.interceptor';

export const coreProviders: ApplicationConfig['providers'] = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ApiKeyInterceptor,
    multi: true
  }
];
