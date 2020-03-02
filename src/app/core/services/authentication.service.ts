import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { StorageService } from '@core/services/storage.service';
import { UserService } from '@core/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private userService: UserService,
    private injector: Injector
  ) { }

  goTo(url: string): void {
    const router = this.injector.get(Router);

    router.navigateByUrl(url);
  }

  hasToken(): boolean {
    return !!this.storageService.get('access_token');
  }

  getAuthorizationToken(): string | null {
    return this.storageService.get('access_token');
  }
}
