import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit, Signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { DataService } from '../../core/services/data.service';
import { TranslationsService } from '../../core/services/translations.service';
import { LangPipe } from '../../core/pipes/lang-pipe';
import { ScrollLockService } from '../../core/services/scroll-lock.service';

@Component({
  selector: 'app-biography',
  standalone: true,
  imports: [CommonModule, LangPipe],
  templateUrl: './biography.html',
  styleUrls: ['./biography.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Biography implements OnInit, OnDestroy {
  isPanelOpen = false;
  bioData: any;
  lang = 'en';

  private subscriptions: Subscription[] = [];
  private biographySignal?: Signal<any | null>;

  @HostListener('window:keydown.escape')
  handleEscKey() {
    if (this.isPanelOpen) this.closePanel();
  }

  constructor(
    private translations: TranslationsService,
    private dataService: DataService,
    private scrollLock: ScrollLockService
  ) {}

  ngOnInit() {
    this.lang = this.translations.getCurrentLang();
    this.biographySignal = this.dataService.getData<any>('biography');
    effect(() => {
      const data = this.biographySignal?.();
      if (!data) {
        return;
      }

      this.bioData = data;
    });

    const langSub = this.translations.currentLang$.subscribe(lang => {
      this.lang = lang;
    });
    this.subscriptions.push(langSub);
  }

  ngOnDestroy() {
    if (this.isPanelOpen) {
      this.scrollLock.unlock();
    }
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  togglePanel() {
    this.isPanelOpen = !this.isPanelOpen;
    if (this.isPanelOpen) {
      this.scrollLock.lock();
    } else {
      this.scrollLock.unlock();
    }
  }

  closePanel() {
    this.isPanelOpen = false;
    this.scrollLock.unlock();
  }

  onPanelClick(event: MouseEvent) {
    if (event.target === event.currentTarget) this.closePanel();
  }

  getText(key: any): string {
    return typeof key === 'string' ? key : key?.[this.lang] || '';
  }

  // Разбиваем текст достижений на отдельные пункты
  getAchievements(content: any): string[] {
    const text = this.getText(content);
    return text.split('\n\n').filter(item => item.trim());
  }

  // Получаем иконку для каждого достижения
  getAchievementIcon(index: number): string {
    const icons = [
      '⚡', // Exploit chains
      '🏗️', // Architecture
      '🔍', // Reverse engineering
      '🎯', // CTF challenges
      '📚', // Books
      '🐧', // Linux
      '👑'  // Red Team
    ];
    return icons[index] || '🚀';
  }
}
