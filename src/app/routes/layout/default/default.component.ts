import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '@core/services/authentication.service';
import { UserService } from '@core/services/user.service';

import { RoleEnum } from '@shared/enums/role-enum';
import { validateFormGroup } from '@shared/utils/form.util';

@Component({
  selector: 'layout-default',
  templateUrl: './default.component.html'
})
export class LayoutDefaultComponent implements OnInit{

  isCollapsed = true;
  activeUser: User.UserInfoModel;
  roleEnum = RoleEnum;
  profileForm: FormGroup;
  showSettingsDrawer = false;
  buttonLoading: boolean;

  constructor(
      private authService: AuthenticationService,
      private userService: UserService,
      private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.activeUser = this.userService.firebaseUserInfo;

    if (this.activeUser.roles) {
      this.activeUser.displayRoles = this.activeUser.roles.map(item => this.roleEnum[item]).join(', ')
    }

    this.createForm();
  }

  createForm(): void {
    this.profileForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      surname: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: [],
      bio: [],
      facebook: [],
      twitter: [],
      instagram: [],
      linkedin: [],
      github: [],
      website: [],
    });

    this.profileForm.patchValue(this.activeUser);
  }

  logOut(): void {
    this.authService.signOut();
  }

  openDrawer(): void {
    this.showSettingsDrawer = true;
  }

  closeDrawer(): void {
    this.showSettingsDrawer = false;
  }

  updateProfile(): void {
    validateFormGroup(this.profileForm);

    if (this.profileForm.invalid) {
      return;
    }

    this.buttonLoading = true;

    const formData: User.UserInfoModel = {
      ...this.activeUser,
      ...this.profileForm.value,
      updated: new Date()
    };

    this.userService.saveUserInfoDB(formData).then(() => {
      this.buttonLoading = false;
      this.showSettingsDrawer = false;
    });
  }
}
