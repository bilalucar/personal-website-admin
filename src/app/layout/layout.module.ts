import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { LoginComponent } from '../routes/login/login.component';
import { LayoutDefaultComponent } from './default/default.component';
import { FullscreenComponent } from './fullscreen/fullscreen.component';
import { SignupComponent } from '../routes/signup/signup.component';

const COMPONENTS = [
  LayoutDefaultComponent,
  FullscreenComponent,
  LoginComponent,
  SignupComponent
];

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    ...COMPONENTS,
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class LayoutModule { }
