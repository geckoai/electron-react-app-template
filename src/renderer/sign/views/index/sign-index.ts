import { GeckoRoute } from '@geckoai/router';
import { Component } from './component';
import { GeckoModule } from '@geckoai/core';

@GeckoRoute({
  index: true,
  Component
})
@GeckoModule
export class SignIndex {}