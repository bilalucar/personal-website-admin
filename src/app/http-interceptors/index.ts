import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { CachingInterceptor } from './caching-interceptor';
import { DefaultInterceptor } from './default-interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true }
];
