import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const userUrl = ``;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  activeUser: any;

  constructor(
      private auth: AngularFireAuth,
      private http: HttpClient
  ) { }

  getAuthenticatedUser(): Observable<any> {
    return this.http.get<any>(`${userUrl}`).pipe(
      tap(res => {
        this.activeUser = res;
      })
    );
  }

  signUp(credential: User.EmailAndPasswordModel) {
    return this.auth.createUserWithEmailAndPassword(credential.email, credential.password);
  }
}
