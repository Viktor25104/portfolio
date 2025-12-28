import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TranslationsService } from '../services/translations.service';

export const languageGuard: CanActivateFn = (route) => {
  const translations = inject(TranslationsService);
  const router = inject(Router);
  const supported = translations.getAvailableLanguages().map((lang) => lang.code);
  const requested = (route.paramMap.get('lang') || '').toLowerCase();

  if (!supported.includes(requested)) {
    return router.parseUrl('/en');
  }

  return true;
};
