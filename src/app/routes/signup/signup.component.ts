import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { validateFormGroup } from '@shared/utils/form.util';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit, OnDestroy {

  signUpForm: FormGroup;
  loading = false;
  error = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
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

    const data: User.EmailAndPasswordModel = {
      email: this.signUpForm.value.email,
      password: this.signUpForm.value.password
    };

    this.loading = true;
    
    this.userService.signUp(data).then(response => {
      console.log('response', response);
    });
  }
  ngOnDestroy(): void {}
}
