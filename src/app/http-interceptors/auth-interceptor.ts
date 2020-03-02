import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AuthenticationService } from '@core/services/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthenticationService) {}

  private static _isSecure(url: string, method: string) {
    const urlReg = /(sessions)/gi;

    if (urlReg.test(url)) {
      return method === 'DELETE'
    }

    return !urlReg.test(url);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (AuthInterceptor._isSecure(req.url, req.method)) {
      // Get the auth token from the service.
      const authToken = this.auth.getAuthorizationToken();

      if (authToken) {
        req = req.clone({
          setHeaders: { Authorization: `Bearer ${authToken}` }
        });
      }
    }

    return next.handle(req);
  }
}
