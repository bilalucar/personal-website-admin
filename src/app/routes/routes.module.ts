import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { RoutesRoutingModule } from './routes-routing.module';

import { ResultComponent } from './result/result.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LayoutDefaultComponent } from './layout/default/default.component';
import { FullscreenComponent } from './layout/fullscreen/fullscreen.component';

const COMPONENTS = [
  // page components
  DashboardComponent,
  LayoutDefaultComponent,
  FullscreenComponent,
  LoginComponent,
  SignupComponent,
  ResultComponent
];

@NgModule({
  imports: [
    SharedModule,
    RoutesRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
  ]
})
export class RoutesModule {}
