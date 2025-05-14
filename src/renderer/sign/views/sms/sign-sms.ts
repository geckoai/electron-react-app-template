import { GeckoRoute } from '@geckoai/router';
import { Component } from './component';
import { GeckoModule } from '@geckoai/core';

@GeckoRoute({
  path: 'sms',
  Component,
})
@GeckoModule
export class SignSms {}