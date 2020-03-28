import { Injectable } from '@angular/core';

import { NgxPermissionsService } from 'ngx-permissions';
import { AngularFirestore } from '@angular/fire/firestore';

import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  PATH = 'users';

  firebaseUserInfo: User.UserInfoModel;
  firebaseUser;

  constructor(
    private permissionsService: NgxPermissionsService,
    private afs: AngularFirestore,
  ) { }

  saveUserInfoDB(data: User.UserInfoModel) {
    return this.afs.doc<any>(`${this.PATH}/${data.id}`).set(data);
  }

  setUserInfo(uid): Promise<void> {
    return new Promise((resolve) => {
      this.afs.doc<any>(`${this.PATH}/${uid}`).valueChanges().subscribe((response: User.UserInfoModel) => {
        this.firebaseUserInfo = response;
        this.setRoles(response.roles);
        resolve();
      });
    })
  }

  setRoles(roles: string[]) {
    this.permissionsService.flushPermissions();
    this.permissionsService.loadPermissions(roles);
  }

  setCurrentUser(currentUser) {
    this.firebaseUser = currentUser;
  }
}
