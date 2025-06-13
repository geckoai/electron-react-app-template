import { Module, Container } from '@geckoai/gecko-core';

import * as ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  ReactRouter,
  RouterService,
} from '@geckoai/platform-react';
import { HomeModule } from './home';
import { I18nGlobalService } from '@geckoai/i18n-react';
import { Fallback } from './fallback';
import { Root } from './root';

import './application.less';

@BrowserRouter
@Module({
  imports: [HomeModule],
  providers: [
    RouterService,
    // Language key of browser `window.navigator.language`
    // Please follow the browser language settings
    I18nGlobalService.for('zh-CN', Fallback),
    ReactRouter.ProvideFallback(Fallback),
  ],
})
export class Application {
  constructor(container: Container, service: RouterService) {
    const root = document.getElementById('root');
    if (root) {
      ReactDOM.createRoot(root).render(
        <Root container={container} router={service.getRouter()} />,
      );
    }
  }
}
