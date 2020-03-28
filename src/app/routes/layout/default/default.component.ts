import { Component } from '@angular/core';

import { AuthenticationService } from '@core/services/authentication.service';

@Component({
  selector: 'layout-default',
  templateUrl: './default.component.html'
})
export class LayoutDefaultComponent {
  isCollapsed = true;

  constructor(
      private authService: AuthenticationService
  ) { }

  logOut() {
    this.authService.signOut();
  }
}
