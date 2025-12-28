import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class TranslationsService {
  private currentLangSignal = signal<string>(this.getStoredLang());
  public currentLang$ = toObservable(this.currentLangSignal);
  private translations = new Map<string, any>();
  private loadedPromise: Promise<void> | null = null;

  constructor(private http: HttpClient) {
    this.loadTranslations();
  }

  setLanguage(lang: string): void {
    this.currentLangSignal.set(lang);
    this.persistLang(lang);
  }

  getCurrentLang(): string {
    return this.currentLangSignal();
  }

  waitForTranslations(): Promise<void> {
    return this.loadedPromise || Promise.resolve();
  }

  instant(key: string): string {
    const lang = this.getCurrentLang();
    const value = this.translations.get(key);
    return value?.[lang] || key;
  }

  private loadTranslations(): Promise<void> {
    if (this.loadedPromise) {
      return this.loadedPromise;
    }

    this.loadedPromise = (async () => {
      const manifest = await firstValueFrom(
        this.http.get<{ files: string[] }>('/assets/data/manifest.json')
      );

      if (!manifest?.files?.length) {
        throw new Error('Invalid manifest.json structure');
      }

      await Promise.all(
        manifest.files.map(async (filePath) => {
          const fileData = await firstValueFrom(this.http.get(`/assets/data/${filePath}`));
          Object.entries(fileData).forEach(([key, value]) => {
            this.translations.set(key, value);
          });
        })
      );
    })().catch((error) => {
      console.error('Failed to load translations:', error);
    });

    return this.loadedPromise;
  }

  getAvailableLanguages(): { code: string; name: string }[] {
    return [
      { code: 'en', name: 'EN' },
      { code: 'uk', name: 'UA' },
      { code: 'ru', name: 'RU' }
    ];
  }

  private getStoredLang(): string {
    try {
      return localStorage.getItem('lang') || 'en';
    } catch {
      return 'en';
    }
  }

  private persistLang(lang: string): void {
    try {
      localStorage.setItem('lang', lang);
    } catch {
      // ignore (SSR or storage disabled)
    }
  }
}
