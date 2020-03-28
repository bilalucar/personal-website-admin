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
  ) {}

  signUp(credential: User.EmailAndPasswordModel) {
    return this.auth.createUserWithEmailAndPassword(credential.email, credential.password);
  }

  signIn(credential: User.EmailAndPasswordModel) {
    return this.auth.signInWithEmailAndPassword(credential.email, credential.password).then((response) => {
      this.firebaseUser = response.user;
      this.router.navigateByUrl('/dashboard');
    });
  }

  signOut() {
    this.auth.signOut().then(() => {
      this.router.navigateByUrl('/login');
    });
  }
}
