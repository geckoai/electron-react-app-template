import { GeckoModule } from '@geckoai/gecko-core';
import { ReactRouter } from '@geckoai/gecko-router';
import { SignModule } from './sign';
import { HomeModule } from './home';


@GeckoModule({ imports: [ReactRouter, HomeModule, SignModule] })
export class Application {}