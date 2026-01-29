import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiKeyInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Only append api_key to TMDB API requests
    if (req.url.includes('themoviedb.org')) {
      const apiKey = environment.tmdb.apiKey;
      const clonedReq = req.clone({
        params: req.params.set('api_key', apiKey)
      });
      return next.handle(clonedReq);
    }

    return next.handle(req);
  }
}
