import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import { NgxPermissionsService } from 'ngx-permissions';
import { UserService } from '@core/services/user.service';

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
    return this.auth.createUserWithEmailAndPassword(data.credential.email, data.credential.password).then((response) => {
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
    return this.auth.signInWithEmailAndPassword(credential.email, credential.password).then((response) => {
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
