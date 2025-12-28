import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Inject, Injectable } from '@angular/core';

interface MetaPayload {
  lang: string;
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly supportedLanguages = ['en', 'uk', 'ru'];
  private readonly localeMapping: Record<string, string> = {
    en: 'en_US',
    uk: 'uk_UA',
    ru: 'ru_RU'
  };

  constructor(
    private readonly meta: Meta,
    private readonly title: Title,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  applyLanguage(lang: string, url: string): void {
    if (this.document?.documentElement) {
      this.document.documentElement.lang = lang;
    }

    const normalizedPath = this.stripLangFromPath(url);
    this.updateAlternateLinks(lang, normalizedPath);
  }

  updateMetaTags(payload: MetaPayload): void {
    const { lang, title, description, keywords, image, url } = payload;

    if (title) {
      this.title.setTitle(title);
      this.meta.updateTag({ property: 'og:title', content: title });
      this.meta.updateTag({ name: 'twitter:title', content: title });
    }

    if (description) {
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ property: 'og:description', content: description });
      this.meta.updateTag({ name: 'twitter:description', content: description });
    }

    if (keywords) {
      this.meta.updateTag({ name: 'keywords', content: keywords });
    }

    if (image) {
      this.meta.updateTag({ property: 'og:image', content: image });
      this.meta.updateTag({ name: 'twitter:image', content: image });
    }

    if (url) {
      const normalizedUrl = this.normalizeUrl(url);
      this.meta.updateTag({ property: 'og:url', content: normalizedUrl });
      this.setCanonicalLink(normalizedUrl);
    }

    const locale = this.localeMapping[lang] || 'en_US';
    this.meta.updateTag({ property: 'og:locale', content: locale });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
  }

  private updateAlternateLinks(activeLang: string, tailPath: string): void {
    const basePath = tailPath.startsWith('/') ? tailPath : `/${tailPath}`;
    const normalizedTail = basePath === '/' ? '' : basePath;

    this.supportedLanguages.forEach((lang) => {
      const href = `${lang ? '/' + lang : ''}${normalizedTail}` || `/${lang}`;
      const linkElement = this.getOrCreateAlternateLink(lang);
      linkElement.setAttribute('href', href.replace(/\/{2,}/g, '/'));
    });

    const defaultLink = this.getOrCreateAlternateLink('x-default');
    const defaultHref = `/${activeLang}${normalizedTail}`.replace(/\/{2,}/g, '/');
    defaultLink.setAttribute('href', defaultHref);
  }

  private setCanonicalLink(url: string): void {
    if (!url) {
      return;
    }

    let linkElement = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!linkElement) {
      linkElement = this.document.createElement('link');
      linkElement.setAttribute('rel', 'canonical');
      this.document.head.appendChild(linkElement);
    }

    linkElement.setAttribute('href', url);
  }

  private normalizeUrl(url: string): string {
    const [path] = url.split('?');
    return path.replace(/\/{2,}/g, '/');
  }

  private getOrCreateAlternateLink(lang: string): HTMLLinkElement {
    const selector = `link[rel="alternate"][hreflang="${lang}"]`;
    let linkElement = this.document.querySelector<HTMLLinkElement>(selector);

    if (!linkElement) {
      linkElement = this.document.createElement('link');
      linkElement.setAttribute('rel', 'alternate');
      linkElement.setAttribute('hreflang', lang);
      this.document.head.appendChild(linkElement);
    }

    return linkElement;
  }

  private stripLangFromPath(url: string): string {
    if (!url) {
      return '';
    }

    const [path] = url.split('?');
    const segments = path.split('/').filter(Boolean);
    if (segments.length === 0) {
      return '';
    }

    const [, ...rest] = segments;
    return rest.length ? `/${rest.join('/')}` : '';
  }
}
