import 'reflect-metadata';
import 'normalize.css/normalize.css';
import reportWebVitals from 'src/renderer/reportWebVitals';
import { Application } from './application';

import * as ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { ReactRouter } from '@geckoai/gecko-router';
import { Bootstrap } from '@geckoai/gecko-core';

const root = document.getElementById('root');

const module = Bootstrap.run(Application);

if (root) {
  ReactDOM.createRoot(root).render(
    <StrictMode>
      <ReactRouter.Provider
        module={module}
      />
    </StrictMode>
  );
}

reportWebVitals();
