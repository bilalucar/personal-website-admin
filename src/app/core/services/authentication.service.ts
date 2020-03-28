import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import { StorageService } from '@core/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  firebaseUser;

  constructor(
      private auth: AngularFireAuth,
      private storageService: StorageService,
      private router: Router
  ) {
    auth.authState.subscribe(response => {
      this.firebaseUser = response;
    })
  }

  goTo(route: string): void {
    this.router.navigateByUrl(route);
  }

  isLoggedIn(): boolean {
    return !!this.firebaseUser;
  }

  signUp(credential: User.EmailAndPasswordModel) {
    return this.auth.createUserWithEmailAndPassword(credential.email, credential.password);
  }

  signIn(credential: User.EmailAndPasswordModel) {
    return this.auth.signInWithEmailAndPassword(credential.email, credential.password).then((response) => {
      this.setCurrentUser(response.user);
      this.router.navigateByUrl('/dashboard');
    });
  }

  setCurrentUser(currentUser) {
    this.firebaseUser = currentUser;
  }

  signOut() {
    this.auth.signOut().then(() => {
      this.router.navigateByUrl('/login');
    });
  }
}
