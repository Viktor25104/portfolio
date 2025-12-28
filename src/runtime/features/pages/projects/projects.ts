import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, Signal, effect } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LangPipe } from '../../../pipes/lang-pipe';
import { DataService } from '../../../../infrastructure/http/data.service';
import { TranslationsService } from '../../../../infrastructure/http/translations.service';
import { ProjectModalComponent } from '../project-detail/project-detail';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, LangPipe, ProjectModalComponent],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Projects implements OnInit, OnDestroy {
  sectionTitle = '';
  sectionSubtitle = '';
  projects: any[] = [];
  filteredProjects: any[] = [];
  categories: { name: string }[] = [];
  selectedCategory = 'All';
  selectedProject: any = null;

  private subscriptions: Subscription[] = [];
  private projectsLoaded = false;
  private projectsSignal?: Signal<any | null>;

  constructor(
    private dataService: DataService,
    public translations: TranslationsService,
    private cdr: ChangeDetectorRef
  ) {
    this.projectsSignal = this.dataService.getData<any>('projects');
    effect(() => {
      const data = this.projectsSignal?.();
      if (!data) {
        return;
      }

      this.projects = data.projects || [];
      this.projectsLoaded = true;

      const rawCategories = this.projects.map(p => p.category);
      const unique = Array.from(new Set(rawCategories));
      this.categories = unique.map(name => ({ name }));

      this.updateTranslations();
      this.filterProjects(this.selectedCategory);
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {
    // И подписываемся на изменения языка
    const langSub = this.translations.currentLang$.subscribe(() => {
      this.updateTranslations();
    });

    this.subscriptions.push(langSub);

    // Инициализируем переводы
    this.updateTranslations();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private updateTranslations() {
    // Безопасно получаем переводы
    this.sectionTitle = this.safeTranslate('PROJECTS_TITLE', 'My Projects');
    this.sectionSubtitle = this.safeTranslate('PROJECTS_SUBTITLE', 'A showcase of my work');

    // Если проекты уже загружены, обновляем фильтр
    if (this.projectsLoaded) {
      this.filterProjects(this.selectedCategory);
    }
    this.cdr.markForCheck();
  }

  filterProjects(category: string): void {
    this.selectedCategory = category;
    this.filteredProjects = category === 'All'
      ? [...this.projects]
      : this.projects.filter(p => p.category === category);
    this.cdr.markForCheck();
  }

  viewProjectDetail(project: any): void {
    this.selectedProject = project;
  }

  closeProjectModal(): void {
    this.selectedProject = null;
  }

  getCategoryTranslationKey(category: string): string {
    const mapping: Record<string, string> = {
      'All': 'ALL_PROJECTS',
      'Web': 'WEB_DEVELOPMENT',
      'Mobile': 'MOBILE_APPS',
      'Games': 'GAMES',
      'Blockchain': 'BLOCKCHAIN',
      'Cybersecurity': 'CYBERSECURITY'
    };
    return mapping[category] || category.toUpperCase();
  }

  getProjectTitle(project: any): string {
    const lang = this.translations.getCurrentLang();
    const title = project.title?.[lang] || project.title?.['en'] || project.title || 'Untitled Project';
    return title;
  }

  // Метод для безопасного получения перевода
  safeTranslate(key: string, fallback: string = ''): string {
    const translation = this.translations.instant(key);
    const result = translation !== key ? translation : fallback;
    return result;
  }
}
