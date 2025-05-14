import { injectable } from '@geckoai/core';

@injectable()
export class GlobalService {
  public key = Date.now()
}