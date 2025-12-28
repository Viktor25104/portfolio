import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { gsap } from 'gsap';
import { DataService } from '../../core/services/data.service';
import { TranslationsService } from '../../core/services/translations.service';
import { LangPipe } from '../../core/pipes/lang-pipe';
import { isPlatformBrowser } from '@angular/common';

interface Language {
  code: string;
  name: string;
}

@Component({
  selector: 'app-header',
  imports: [CommonModule, LangPipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header implements OnInit, OnDestroy {
  availableLanguages: Language[] = [];
  currentLang: string = '';
  photos = [
    { url: 'assets/images/profile-main.jpg', alt: 'Main profile photo' },
    { url: 'assets/images/profile-side.jpg', alt: 'Side profile photo' }
  ];
  private subscriptions: Subscription[] = [];

  constructor(
    public translations: TranslationsService,
    private dataService: DataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.availableLanguages = [
      { code: 'en', name: 'EN' },
      { code: 'uk', name: 'UA' },
      { code: 'ru', name: 'RU' }
    ];
    this.currentLang = this.translations.getCurrentLang();
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeAnimations();
    }

    const langSub = this.translations.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });
    this.subscriptions.push(langSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onLanguageChange(lang: string): void {
    this.translations.setLanguage(lang);
  }

  private initializeAnimations() {
    // Убираем GSAP анимации для фото, чтобы они не конфликтовали с CSS
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.text-content', {
      opacity: 0,
      y: 30,
      duration: 1
    })
      // Убираем анимации фото из GSAP - теперь они в CSS
      .from('.language-switcher', {
        opacity: 0,
        y: -20,
        duration: 0.5
      }, '-=0.3');
  }

  protected readonly Date = Date;
}
