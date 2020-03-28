import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// layout
import { LayoutDefaultComponent } from './layout/default/default.component';
import { FullscreenComponent } from './layout/fullscreen/fullscreen.component';

// pages
import { LoginComponent } from './login/login.component';
import { ResultComponent } from './result/result.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignupComponent } from './signup/signup.component';

// guards
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'posts', loadChildren: () => import('./posts/posts.module').then(m => m.PostsModule), },
      { path: '401', component: ResultComponent },
      { path: '403', component: ResultComponent },
      { path: '404', component: ResultComponent }
    ]
  },
  {
    path: '',
    component: FullscreenComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class RoutesRoutingModule {}
