import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TranslationsService } from '../../core/services/translations.service';
import { DataService } from '../../core/services/data.service';
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
    private dataService: DataService,
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
    this.isHomePage = this.router.url === '/';

    // Wait for translations to load
    this.translations.waitForTranslations().then(() => {
      console.log('Translations ready in navbar');
    });

    const routeSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isHomePage = event.url === '/';
    });
    this.subscriptions.push(routeSub);

    const langSub = this.translations.currentLang$.subscribe(lang => {
      this.currentLang = lang;
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
    this.translations.setLanguage(lang);
    this.closeMenu();
  }

  scrollToSection(sectionId: string): void {
    this.closeMenu();

    if (this.isHomePage) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          const section = document.getElementById(sectionId);
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      });
    }
  }
}
