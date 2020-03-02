import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env/environment';

export interface IRequestCacheEntry {
  url: string;
  response: HttpResponse<any>;
  lastRead: number;
}

export abstract class RequestCache {
  abstract get(req: HttpRequest<any>): HttpResponse<any> | undefined;
  abstract put(req: HttpRequest<any>, response: HttpResponse<any>): void;
}

const maxAge = 15000; // maximum cache age (ms)

@Injectable({
  providedIn: 'root'
})
export class RequestCacheWithMap implements RequestCache {

  cache = new Map<string, IRequestCacheEntry>();

  constructor() { }

  get(req: HttpRequest<any>): HttpResponse<any> | undefined {
    const url = req.urlWithParams;
    const cached = this.cache.get(url);

    if (!cached) {
      return undefined;
    }

    const isExpired = cached.lastRead < (Date.now() - maxAge);
    const expired = isExpired ? 'expired ' : '';

    if (!environment.production) {
      console.log(`Found ${expired}cached response for '${url}'.`);
    }

    return isExpired ? undefined : cached.response;
  }

  put(req: HttpRequest<any>, response: HttpResponse<any>): void {
    const url = req.urlWithParams;

    if (!environment.production) {
      console.log(`Caching response from '${url}'.`);
    }

    const entry = { url, response, lastRead: Date.now() };

    this.cache.set(url, entry);

    // remove expired cache entries
    const expired = Date.now() - maxAge;
    this.cache.forEach(cacheEntry => {
      if (cacheEntry.lastRead < expired) {
        this.cache.delete(cacheEntry.url);
      }
    });

    if (!environment.production) {
      console.log(`Request cache size: ${this.cache.size}.`);
    }
  }
}
