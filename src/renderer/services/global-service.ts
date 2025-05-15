import { injectable } from '@geckoai/gecko-core';

@injectable()
export class GlobalService {
  public key = Date.now()
}