import { AES, enc, MD5 } from 'crypto-js';

export class Crypto {
  public static encrypt(data: Object, pwd: string): string {
    return AES.encrypt(JSON.stringify(data), pwd).toString();
  }

  public static decrypt(data: string, pwd: string): string {
    return AES.decrypt(data, pwd).toString(enc.Utf8);
  }

  public static getKey(token: string, version: string) {
    return MD5(token + version).toString();
  }
}
