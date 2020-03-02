import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html'
})
export class ResultComponent {

  path: string;
  
  constructor(private route: ActivatedRoute) {
    this.path = route.snapshot.routeConfig.path;
  }
}
