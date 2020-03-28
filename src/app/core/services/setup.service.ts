import { Injectable, Injector } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class SetupService {

  constructor(private auth: AngularFireAuth,
              private authenticationService: AuthenticationService,
              private injector: Injector) {}

  initialize(): Promise<void> {
    return new Promise((resolve) => {
      this.auth.onAuthStateChanged(user => {
        if (user) {
          this.authenticationService.setCurrentUser(user);
          resolve();
        } else {
          const router = this.injector.get(Router);

          router.navigateByUrl('/login');
          resolve();
        }
      }).then();
    });
  }

}
