import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SetupService {

  constructor() {}

  initialize(): Promise<void> {
    return new Promise((resolve) => {
      resolve();
    });
  }

}
