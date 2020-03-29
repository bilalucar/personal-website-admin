import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { RoleConstantEnum } from '@shared/enums/role-constant.enum';

import { NgxPermissionsService } from 'ngx-permissions';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  PATH = 'users';

  firebaseUser;
  firebaseUserInfo: User.UserInfoModel;
  isAdmin: boolean;
  isUser: boolean;

  constructor(
    private permissionsService: NgxPermissionsService,
    private afs: AngularFirestore
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

  setRoles(roles: string[]): void {
    this.permissionsService.flushPermissions();
    this.permissionsService.loadPermissions(roles);
    this.setPermissions(roles)
  }

  setCurrentUser(currentUser): void {
    this.firebaseUser = currentUser;
  }

  clearPermissions(): void {
    this.isAdmin = false;
    this.isUser = false;
  }

  setPermissions(roles: string[]): void {
    this.clearPermissions();
    roles.forEach((role) => {
      switch (role) {
        case RoleConstantEnum.ROLE_ADMIN:
          this.isAdmin = true;
          break;
        case RoleConstantEnum.ROLE_USER:
          this.isUser = true;
          break;
      }
    });
  }
}
