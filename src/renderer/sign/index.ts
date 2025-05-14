import { GeckoModule } from '@geckoai/core';
import { SignSms } from './views/sms/sign-sms';
import { SignIndex } from './views/index/sign-index';
import { GeckoRoute } from '@geckoai/router';
import { Component } from './component';

@GeckoModule({
  imports: [
    SignIndex,
    SignSms,
  ]
})
@GeckoRoute({
  path: 'sign',
  Component
})
export class SignModule {}