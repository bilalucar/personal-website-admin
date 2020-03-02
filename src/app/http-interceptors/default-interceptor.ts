import {
  HttpErrorResponse,
  HttpHandler,
  HttpHeaderResponse,
  HttpInterceptor,
  HttpProgressEvent,
  HttpRequest,
  HttpResponse,
  HttpSentEvent,
  HttpUserEvent,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';

import { environment } from '@env/environment';

/**
 * The default HTTP interceptor
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  constructor(
    private notificationService: NzNotificationService,
    private nzMessageService: NzMessageService,
    private router: Router
  ) { }

  private goTo(url: string) {
    setTimeout(() => this.router.navigateByUrl(url));
  }

  private handleData(event: HttpResponse<any> | HttpErrorResponse): Observable<any> {
    // Business Rules
    switch (event.status) {
      case 200:
      case 201:
      case 202:
      case 203:
      case 204:
        if (event instanceof HttpErrorResponse) {
          if (!environment.production) {
            this.nzMessageService.error(event.message);
          }
          return throwError(event);
        }
        break;
      case 400:
        return throwError(event);
      case 401: // unauthorized request
        this.goTo('/login');
        return throwError(event);
      case 403:
        this.goTo('/403');
        return throwError(event);
      case 404:
        this.goTo('/404');
        return throwError(event);
      case 500:
        return throwError(event);
      default:
        if (event instanceof HttpErrorResponse) {
          if (!environment.production) {
            this.nzMessageService.error(event.message);
          }
        }
        return throwError(event);
    }
    return of(event);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<| HttpSentEvent
    | HttpHeaderResponse
    | HttpProgressEvent
    | HttpResponse<any>
    | HttpUserEvent<any>> {

    return next.handle(req).pipe(
      mergeMap((event: any) => {
        // Allows uniform handling of request errors, because a request if the status of its HTTP request is 200 if it is a business error
        if (event instanceof HttpResponse && event.status.toString().startsWith('20')) {

          // Global Notification Service for CRUD operations
          let title: string;

          if (req.method === 'PUT') {
            title = 'Update Successful';
          }

          if (req.method === 'POST') {
            title = 'Create Successful';
          }

          if (req.method === 'DELETE') {
            title = 'Delete Successful';
          }

          if (req.method === 'PUT' || req.method === 'POST' || req.method === 'DELETE') {
            if (!req.url.endsWith('token')) {
              this.notificationService.success(title, null);
            }
          }

          return this.handleData(event);
        }
        // If everything is ok, follow-up
        return of(event);
      }),
      catchError((err: HttpErrorResponse) => {
        // Global Notification Service for error handling of CRUD operations
        let title: string;

        if (req.method === 'PUT') {
          title = 'Update Failed';
        }

        if (req.method === 'POST') {
          title = 'Create Failed';
        }

        if (req.method === 'DELETE') {
          title = 'Delete Failed';
        }

        if (err.status === 409) {
          title = 'Record already exist!';
        }

        if (req.method === 'PUT' || req.method === 'POST' || req.method === 'DELETE' || err.status === 409) {
          this.notificationService.error(title, 'Oops there was en error with the operation');
        }

        return this.handleData(err);
      })
    );
  }
}
