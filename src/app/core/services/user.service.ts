import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const userUrl = ``;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  activeUser: any;

  constructor(
    private http: HttpClient
  ) { }

  getAuthenticatedUser(): Observable<any> {
    return this.http.get<any>(`${userUrl}`).pipe(
      tap(res => {
        this.activeUser = res;
      })
    );
  }
}
