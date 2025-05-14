import { GeckoRoute } from '@geckoai/router';
import { Component } from './component';

@GeckoRoute({
  index: true,
  Component,
})
export class HomeModule {}