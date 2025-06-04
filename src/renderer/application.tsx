import { GeckoModule, inject } from '@geckoai/gecko-core';
import { Router } from './router';
import * as ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { ReactRouter } from '@geckoai/gecko-router';
import { RouterProvider } from 'react-router-dom';
import { RouterProviderProps } from 'react-router';
import { I18nService } from '@geckoai/gecko-i18n';

@GeckoModule({ imports: [Router], providers: [I18nService] })
export class Application {
  constructor(@inject(ReactRouter.Router) router: RouterProviderProps['router']) {
    const root = document.getElementById('root');
    if (root) {
      ReactDOM.createRoot(root).render(
        <StrictMode>
          <RouterProvider
            router={router}
          />
        </StrictMode>
      );
    }
  }
}