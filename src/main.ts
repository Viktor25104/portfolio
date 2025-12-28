import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './runtime/app/app.config';
import { App } from './runtime/app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
