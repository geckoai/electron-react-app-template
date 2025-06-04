import { ReactRouter, BrowserRouter } from '@geckoai/gecko-router';
import { GeckoModule, UseBase } from '@geckoai/gecko-core';
import { HomeModule } from './home';
import { SignModule } from './sign';


@UseBase
@BrowserRouter
@GeckoModule({ imports: [HomeModule, SignModule] })
export class Router extends ReactRouter {
}