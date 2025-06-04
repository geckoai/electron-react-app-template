import { Route } from '@geckoai/gecko-router';
import { SignSms } from './views/sms/sign-sms';
import { SignIndex } from './views/index/sign-index';
import { GeckoModule } from '@geckoai/gecko-core';

@Route({
  path: 'sign'
})
@GeckoModule({ imports: [SignIndex, SignSms] })
export class SignModule {
}