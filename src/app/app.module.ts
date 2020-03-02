import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from '@core/core.module';
import { RequestCache, RequestCacheWithMap } from '@core/services/request-cache.service';
import { SharedModule } from '@shared/shared.module';

import { en_US, NZ_CONFIG, NZ_I18N, NzConfig } from 'ng-zorro-antd';

import { AppComponent } from './app.component';
import { httpInterceptorProviders } from './http-interceptors';
import { LayoutModule } from './layout/layout.module';
import { RoutesModule } from './routes/routes.module';

registerLocaleData(en);

const ngZorroConfig: NzConfig = {
  notification: {
    nzPlacement: 'bottomRight'
  }
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    RoutesModule,
    LayoutModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_CONFIG, useValue: ngZorroConfig },
    { provide: RequestCache, useClass: RequestCacheWithMap },
    ...httpInterceptorProviders,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
