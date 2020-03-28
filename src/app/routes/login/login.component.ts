import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { validateFormGroup } from '@shared/utils/form.util';
import { AuthenticationService } from '@core/services/authentication.service';

import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  loading = false;
  error = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private notificationService: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [false]
    });
  }

  submitForm(): void {
    if (this.loading) {
      return;
    }

    validateFormGroup(this.loginForm);

    if (this.loginForm.invalid) {
      return;
    }

    const data = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.loading = true;

    this.authService.signIn(data).then(() => {
      this.loading = false;
    }).catch(reason => {
      this.loading = false;
      this.notificationService.error('Error!', reason.message);
      console.log('reason', reason);
    });
  }
  ngOnDestroy(): void {}
}
