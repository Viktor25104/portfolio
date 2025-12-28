import { TestBed } from '@angular/core/testing';
import { convertToParamMap, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LanguageResolver } from './language.resolver';
import { TranslationsService } from '../services/translations.service';
import { SeoService } from '../services/seo.service';

class MockTranslationsService {
  private currentLang = 'en';
  currentLang$ = {
    subscribe: () => ({ unsubscribe: () => null })
  } as any;

  waitForTranslations = jasmine.createSpy('waitForTranslations').and.returnValue(Promise.resolve());
  setLanguage = jasmine.createSpy('setLanguage').and.callFake((lang: string) => {
    this.currentLang = lang;
  });

  getCurrentLang(): string {
    return this.currentLang;
  }

  getAvailableLanguages() {
    return [
      { code: 'en', name: 'EN' },
      { code: 'uk', name: 'UA' },
      { code: 'ru', name: 'RU' }
    ];
  }

  instant(key: string): string {
    return key;
  }
}

describe('LanguageResolver', () => {
  let resolver: LanguageResolver;
  let translations: MockTranslationsService;
  let seo: jasmine.SpyObj<SeoService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LanguageResolver,
        { provide: TranslationsService, useClass: MockTranslationsService },
        {
          provide: SeoService,
          useValue: jasmine.createSpyObj('SeoService', ['applyLanguage', 'updateMetaTags'])
        }
      ]
    });

    resolver = TestBed.inject(LanguageResolver);
    translations = TestBed.inject(TranslationsService) as unknown as MockTranslationsService;
    seo = TestBed.inject(SeoService) as jasmine.SpyObj<SeoService>;
  });

  it('applies language and updates home meta tags', async () => {
    const route = { paramMap: convertToParamMap({ lang: 'en' }) } as ActivatedRouteSnapshot;
    const state = { url: '/en' } as RouterStateSnapshot;

    const result = await resolver.resolve(route, state);

    expect(result).toBe('en');
    expect(translations.setLanguage).toHaveBeenCalledWith('en');
    expect(seo.applyLanguage).toHaveBeenCalledWith('en', '/en');
    expect(seo.updateMetaTags).toHaveBeenCalled();
  });

  it('skips home meta tags for project page', async () => {
    const route = { paramMap: convertToParamMap({ lang: 'uk' }) } as ActivatedRouteSnapshot;
    const state = { url: '/uk/project/demo' } as RouterStateSnapshot;

    const result = await resolver.resolve(route, state);

    expect(result).toBe('uk');
    expect(translations.setLanguage).toHaveBeenCalledWith('uk');
    expect(seo.applyLanguage).toHaveBeenCalledWith('uk', '/uk/project/demo');
    expect(seo.updateMetaTags).not.toHaveBeenCalled();
  });
});
