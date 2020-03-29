import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '@core/services/authentication.service';

import { validateFormGroup } from '@shared/utils/form.util';
import { RoleConstantEnum } from '@shared/enums/role-constant.enum';
import { createGravatarUrl } from '@shared/utils/crypto.util';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit, OnDestroy {

  signUpForm: FormGroup;
  loading = false;
  error = false;

  roleConstantEnum = RoleConstantEnum;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      name: [null, [Validators.required]],
      surname: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    });
  }

  submitForm(): void {
    if (this.loading) {
      return;
    }

    validateFormGroup(this.signUpForm);

    if (this.signUpForm.invalid) {
      return;
    }

    const { name, surname, email, password } = this.signUpForm.value;

    const data: User.AllUserModel = {
      credential: { email, password },
      info: {
        id: '',
        username: email,
        name,
        surname,
        fullName: `${name} ${surname}`,
        email,
        avatar: createGravatarUrl(email),
        created: new Date(),
        roles: [this.roleConstantEnum.ROLE_USER],
      }
    };

    this.loading = true;
    
    this.authService.signUp(data).then(() => {
      this.loading = false;
    }).catch(error => {
      this.loading = false;
      console.log('error', error);
    });
  }
  ngOnDestroy(): void {}
}
