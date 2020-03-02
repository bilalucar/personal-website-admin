import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { validateFormGroup } from '@shared/utils/form.util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  loading = false;
  error = false;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: [null, [Validators.required]],
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
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    this.loading = true;
  }
  ngOnDestroy(): void {}
}
