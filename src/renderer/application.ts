import { GeckoModule } from '@geckoai/core';
import { ReactRouter } from '@geckoai/router';
import { SignModule } from './sign';
import { HomeModule } from './home';
import { GlobalService } from './services/global-service';
import { TestAModule, TestBService } from './test';


@GeckoModule({ imports: [ReactRouter, HomeModule, SignModule, TestAModule], providers: [GlobalService] })
export class Application {
  constructor(private bService: TestBService) {}
}