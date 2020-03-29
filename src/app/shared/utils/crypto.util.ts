import * as CryptoJS from 'crypto-js';
import { environment } from '@env/environment';

export const createMD5Hash = (text: string): string => {
  return CryptoJS.MD5(text).toString();
};

export const createGravatarUrl = (email: string): string => {
  return environment.gravatarBaseUrl + createMD5Hash(email);
};
