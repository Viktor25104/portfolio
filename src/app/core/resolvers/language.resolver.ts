import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TranslationsService } from '../services/translations.service';
import { SeoService } from '../services/seo.service';

@Injectable({ providedIn: 'root' })
export class LanguageResolver implements Resolve<string> {
  private readonly translations = inject(TranslationsService);
  private readonly seo = inject(SeoService);
  private readonly supportedLangs = this.translations.getAvailableLanguages().map((lang) => lang.code);

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<string> {
    await this.translations.waitForTranslations();

    const requestedLang = (route.paramMap.get('lang') || '').toLowerCase();
    const fallbackLang = this.translations.getAvailableLanguages()[0]?.code ?? 'en';
    const resolvedLang = this.supportedLangs.includes(requestedLang) ? requestedLang : fallbackLang;

    this.translations.setLanguage(resolvedLang);
    this.seo.applyLanguage(resolvedLang, state.url);

    this.seo.updateMetaTags({
      lang: resolvedLang,
      title: this.translations.instant('HOME_META_TITLE'),
      description: this.translations.instant('HOME_META_DESCRIPTION'),
      keywords: this.translations.instant('HOME_META_KEYWORDS'),
      url: state.url
    });

    return resolvedLang;
  }
}
