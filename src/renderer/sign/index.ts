import { GeckoRouteModule } from '@geckoai/gecko-router';
import { SignSms } from './views/sms/sign-sms';
import { SignIndex } from './views/index/sign-index';
import { Component } from './component';

@GeckoRouteModule({
  path: 'sign',
  Component
}, {
  imports: [
    SignIndex,
    SignSms
  ]
})
export class SignModule {
}