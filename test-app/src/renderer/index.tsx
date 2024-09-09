import 'reflect-metadata';
import React from 'react';
import 'normalize.css/normalize.css';
import { RouterFactory } from '@packages/router';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import reportWebVitals from 'src/renderer/reportWebVitals';
import { ApplicationModule } from './application';

const root = document.getElementById('root');
const router = RouterFactory.create(ApplicationModule);

// const html = document.querySelector('html');

// if (html) {
//   html.style.fontSize = BASE_FONT_SIZE / window.devicePixelRatio + 'px';
//
//   window.addEventListener('resize', () => {
//     html.style.fontSize = BASE_FONT_SIZE / window.devicePixelRatio + 'px';
//   });
// }

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <RecoilRoot>
        <RouterProvider router={router} />
      </RecoilRoot>
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your router, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

reportWebVitals();
