import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from '../../runtime/app/app';
import { config } from '../../runtime/app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(App, config, context);

export default bootstrap;
