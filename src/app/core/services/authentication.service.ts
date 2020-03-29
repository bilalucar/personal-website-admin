import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import { NgxPermissionsService } from 'ngx-permissions';
import { UserService } from '@core/services/user.service';
import { createMD5Hash } from '@shared/utils/crypto.util';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
      private auth: AngularFireAuth,
      private permissionsService: NgxPermissionsService,
      private userService: UserService,
      private router: Router
  ) {
    auth.authState.subscribe(response => {
      this.userService.firebaseUser = response;
    })
  }

  goTo(route: string): void {
    this.router.navigateByUrl(route);
  }

  isLoggedIn(): boolean {
    return !!this.userService.firebaseUser;
  }

  signUp(data: User.AllUserModel) {
    const { credential: { email } } = data;

    let { credential: { password } } = data;

    password = createMD5Hash(password);

    return this.auth.createUserWithEmailAndPassword(email, password).then((response) => {
      this.userService.setCurrentUser(response.user);
      data.info.id = response.user.uid;
      this.userService.saveUserInfoDB(data.info).then(() => {
        this.userService.setUserInfo(response.user.uid).then(() => {
          this.router.navigateByUrl('/dashboard');
        });
      });
    });
  }

  signIn(credential: User.EmailAndPasswordModel) {
    const { email } = credential;

    let { password } = credential;

    password = createMD5Hash(password);

    return this.auth.signInWithEmailAndPassword(email, password).then((response) => {
      this.userService.setCurrentUser(response.user);
      this.userService.setUserInfo(response.user.uid).then(() => {
        this.router.navigateByUrl('/dashboard');
      });
    });
  }

  signOut() {
    this.auth.signOut().then(() => {
      this.router.navigateByUrl('/login');
    });
  }
}
