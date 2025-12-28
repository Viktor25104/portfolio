import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  let seo: SeoService;
  let meta: Meta;
  let title: Title;
  let document: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SeoService, Meta, Title]
    });

    seo = TestBed.inject(SeoService);
    meta = TestBed.inject(Meta);
    title = TestBed.inject(Title);
    document = TestBed.inject(DOCUMENT);
    document.head.querySelectorAll('link[rel="alternate"], link[rel="canonical"]').forEach((node) => node.remove());
  });

  it('updates meta tags and canonical link', () => {
    seo.updateMetaTags({
      lang: 'en',
      title: 'Test Title',
      description: 'Test Description',
      keywords: 'alpha, beta',
      image: '/img.png',
      url: '/en'
    });

    expect(title.getTitle()).toBe('Test Title');
    expect(meta.getTag("property='og:title'")?.content).toBe('Test Title');
    expect(meta.getTag("name='description'")?.content).toBe('Test Description');
    expect(meta.getTag("property='og:description'")?.content).toBe('Test Description');
    expect(meta.getTag("name='keywords'")?.content).toBe('alpha, beta');
    expect(meta.getTag("property='og:image'")?.content).toBe('/img.png');
    expect(meta.getTag("property='og:url'")?.content).toBe('/en');
    expect(meta.getTag("property='og:locale'")?.content).toBe('en_US');
    expect(meta.getTag("property='og:type'")?.content).toBe('website');
    expect(meta.getTag("name='twitter:card'")?.content).toBe('summary_large_image');

    const canonical = document.head.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute('href')).toBe('/en');
  });

  it('sets alternate links on language apply', () => {
    seo.applyLanguage('uk', '/uk/project/demo');

    expect(document.documentElement.lang).toBe('uk');

    const enLink = document.head.querySelector('link[rel="alternate"][hreflang="en"]');
    const ukLink = document.head.querySelector('link[rel="alternate"][hreflang="uk"]');
    const ruLink = document.head.querySelector('link[rel="alternate"][hreflang="ru"]');
    const defaultLink = document.head.querySelector('link[rel="alternate"][hreflang="x-default"]');

    expect(enLink?.getAttribute('href')).toBe('/en/project/demo');
    expect(ukLink?.getAttribute('href')).toBe('/uk/project/demo');
    expect(ruLink?.getAttribute('href')).toBe('/ru/project/demo');
    expect(defaultLink?.getAttribute('href')).toBe('/uk/project/demo');
  });
});
