import { Fallback, FallbackNode, Route } from '@geckoai/gecko-router';
import { Component } from './component';
import { GeckoI18n, I18nMap } from '@geckoai/gecko-i18n';
import { locales } from './locales';
import { GeckoModule } from '@geckoai/gecko-core';

@I18nMap(locales)
@Route({
  index: true,
  Component
})
@Fallback(FallbackNode)
@GeckoModule({ imports: [GeckoI18n] })
export class HomeModule {
}