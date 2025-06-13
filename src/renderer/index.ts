import 'reflect-metadata';
import 'normalize.css/normalize.css';
import { Bootstrap } from '@geckoai/gecko-core';
import reportWebVitals from 'src/renderer/reportWebVitals';
import { Application } from './application';

Bootstrap.run(Application);

reportWebVitals();
