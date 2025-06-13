import { Fallback, Route, RouteModuleLifeCycle } from '@geckoai/platform-react';
import { Component } from './component';
import { locales } from './locales';
import { I18nMap, I18nReact } from '@geckoai/i18n-react';
import { Module } from '@geckoai/gecko-core';
import { Skeleton } from './skeleton';

@Route({
  index: true,
  Component,
})
@I18nMap(locales)
@Fallback(Skeleton)
@Module({ imports: [I18nReact] })
export class HomeModule extends RouteModuleLifeCycle {}
