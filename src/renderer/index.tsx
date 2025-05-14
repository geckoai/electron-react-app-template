import 'reflect-metadata';
import 'normalize.css/normalize.css';
import reportWebVitals from 'src/renderer/reportWebVitals';
import { BrowserStartup } from '@geckoai/platform-browser';
import { Application } from './application';

import * as ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { ReactRouter } from '@geckoai/router';

const root = document.getElementById('root');

const startup = BrowserStartup
  .module(Application);

if (root) {
  ReactDOM.createRoot(root).render(
    <StrictMode>
      <ReactRouter.Provider
        startup={startup}
      />
    </StrictMode>
  );
}

reportWebVitals();
