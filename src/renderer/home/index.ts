import { GeckoRouteModule } from '@geckoai/gecko-router';
import { Component } from './component';

@GeckoRouteModule({
  index: true,
  Component
})
export class HomeModule {
}