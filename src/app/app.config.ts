import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { TranslationsService } from './core/services/translations.service';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

function initTranslations(translations: TranslationsService) {
  return () => translations.waitForTranslations();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    {
      provide: APP_INITIALIZER,
      useFactory: initTranslations,
      deps: [TranslationsService],
      multi: true
    }, provideClientHydration(withEventReplay())
  ]
};
