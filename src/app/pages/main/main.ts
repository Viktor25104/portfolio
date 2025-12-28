import { ChangeDetectionStrategy, Component, OnDestroy, Signal, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Navbar } from '../navbar/navbar';
import { Header } from '../header/header';
import { About } from '../about/about';
import { Skills } from '../skills/skills';
import { Projects } from '../projects/projects';
import { Contact } from '../contact/contact';
import { Biography } from '../biography/biography';
import { DataService } from '../../core/services/data.service';
import { SeoService } from '../../core/services/seo.service';
import { TranslationsService } from '../../core/services/translations.service';

type BiographyPayload = {
  name?: Record<string, string> | string;
  title?: Record<string, string> | string;
  location?: Record<string, string> | string;
  email?: string;
  phone?: string;
};

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    Navbar,
    Header,
    About,
    Skills,
    Projects,
    Contact,
    Biography,
  ],
  templateUrl: './main.html',
  styleUrl: './main.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Main implements OnDestroy {
  private readonly dataService = inject(DataService);
  private readonly seo = inject(SeoService);
  private readonly translations = inject(TranslationsService);

  private readonly biographySignal = this.dataService.getData<BiographyPayload>('biography');
  private readonly langSignal = toSignal(this.translations.currentLang$, {
    initialValue: this.translations.getCurrentLang()
  });
  private readonly destroySignal = signal(false);

  private readonly socialLinks = [
    'https://www.linkedin.com/in/viktor-marymorych-8355232a0/',
    'https://github.com/Viktor25104',
    'https://t.me/Viktor_M2'
  ];

  constructor() {
    effect(() => {
      if (this.destroySignal()) {
        return;
      }

      const bio = this.biographySignal();
      if (!bio) {
        return;
      }

      const lang = this.langSignal();
      const name = this.getTranslatedValue(bio.name, lang) || 'Viktor Marymorych';
      const title = this.getTranslatedValue(bio.title, lang) || 'Developer';
      const location = this.getTranslatedValue(bio.location, lang) || 'Ukraine';
      const email = bio.email;
      const phone = bio.phone;

      this.seo.setJsonLd('person', {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name,
        jobTitle: title,
        url: `/${lang}`,
        address: {
          '@type': 'PostalAddress',
          addressCountry: location
        },
        email,
        telephone: phone,
        sameAs: this.socialLinks,
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'inquiries',
          email,
          telephone: phone,
          availableLanguage: ['en', 'uk', 'ru']
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.destroySignal.set(true);
    this.seo.removeJsonLd('person');
  }

  private getTranslatedValue(
    value: Record<string, string> | string | undefined,
    lang: string
  ): string {
    if (!value) {
      return '';
    }

    if (typeof value === 'string') {
      return value;
    }

    return value[lang] || value['en'] || '';
  }
}
