import { Component } from '@angular/core';

import { AuthenticationService } from '@core/services/authentication.service';
import { UserService } from '@core/services/user.service';

import { RoleEnum } from '@shared/enums/role-enum';

@Component({
  selector: 'layout-default',
  templateUrl: './default.component.html'
})
export class LayoutDefaultComponent {

  isCollapsed = true;
  activeUser: User.UserInfoModel;
  roleEnum = RoleEnum;

  constructor(
      private authService: AuthenticationService,
      private userService: UserService
  ) {
    this.activeUser = userService.firebaseUserInfo;

    if (this.activeUser.roles) {
      this.activeUser.displayRoles = this.activeUser.roles.map(item => this.roleEnum[item]).join(', ')
    }
  }

  logOut() {
    this.authService.signOut();
  }
}
