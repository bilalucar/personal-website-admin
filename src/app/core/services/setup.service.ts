import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { AuthenticationService } from '@core/services/authentication.service';
import { UserService } from '@core/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class SetupService {

  constructor(private auth: AngularFireAuth,
              private authenticationService: AuthenticationService,
              private userService: UserService) {}

  initialize(): Promise<void> {
    return new Promise((resolve) => {
      this.auth.onAuthStateChanged(user => {
        if (user) {
          this.userService.setCurrentUser(user);
          this.userService.setUserInfo(user.uid).then(() => {
            resolve();
          });
        } else {
          resolve();
        }
      }).then();
    });
  }

}
