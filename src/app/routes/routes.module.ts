import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { RoutesRoutingModule } from './routes-routing.module';

import { ResultComponent } from './result/result.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const COMPONENTS = [
  // page components
  DashboardComponent,
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
