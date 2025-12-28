import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TranslationsService } from '../../core/services/translations.service';
import { LangPipe } from '../../core/pipes/lang-pipe';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LangPipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Navbar implements OnInit, OnDestroy {
  isMenuOpen = false;
  availableLanguages: { code: string, name: string }[] = [];
  currentLang: string = '';
  isHomePage: boolean = true;
  private subscriptions: Subscription[] = [];

  constructor(
    public translations: TranslationsService,
    private router: Router
  ) {
    this.availableLanguages = [
      { code: 'en', name: 'EN' },
      { code: 'uk', name: 'UA' },
      { code: 'ru', name: 'RU' }
    ];
    this.currentLang = this.translations.getCurrentLang();
  }

  ngOnInit(): void {
    this.isHomePage = this.isHomeRoute(this.router.url);

    // Wait for translations to load
    this.translations.waitForTranslations().then(() => {
      console.log('Translations ready in navbar');
    });

    const routeSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isHomePage = this.isHomeRoute(event.urlAfterRedirects || event.url);
      this.currentLang = this.extractLangFromUrl(event.urlAfterRedirects || event.url) || this.currentLang;
    });
    this.subscriptions.push(routeSub);

    const langSub = this.translations.currentLang$.subscribe(lang => {
      this.currentLang = lang;
      this.isHomePage = this.isHomeRoute(this.router.url);
    });
    this.subscriptions.push(langSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : 'auto';
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    document.body.style.overflow = 'auto';
  }

  onLanguageChange(lang: string): void {
    if (lang === this.currentLang) {
      this.closeMenu();
      return;
    }

    this.translations.setLanguage(lang);
    this.closeMenu();
    this.router.navigate(['/', lang], { replaceUrl: false });
  }

  scrollToSection(sectionId: string): void {
    this.closeMenu();

    if (this.isHomePage) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      this.router.navigate(['/', this.currentLang]).then(() => {
        setTimeout(() => {
          const section = document.getElementById(sectionId);
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      });
    }
  }

  private isHomeRoute(url: string): boolean {
    const normalized = (url || '').split('?')[0];
    const lang = this.extractLangFromUrl(normalized) || this.currentLang;
    return normalized === `/${lang}` || normalized === `/${lang}/`;
  }

  private extractLangFromUrl(url: string): string | null {
    const segments = (url || '').split('?')[0].split('/').filter(Boolean);
    const candidate = segments[0];
    const supported = this.availableLanguages.map((lang) => lang.code);
    return supported.includes(candidate || '') ? candidate : null;
  }
}
