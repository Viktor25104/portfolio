import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangPipe } from '../../core/pipes/lang-pipe';
import { DataService } from '../../core/services/data.service';
import { TranslationsService } from '../../core/services/translations.service';
import { ProjectModalComponent } from '../project-detail/project-detail';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, LangPipe, ProjectModalComponent],
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

  constructor(
    private dataService: DataService,
    public translations: TranslationsService
  ) {}

  ngOnInit(): void {
    console.log('Projects component initialized');

    // Сразу загружаем проекты
    this.loadProjects();

    // И подписываемся на изменения языка
    const langSub = this.translations.currentLang$.subscribe(lang => {
      console.log('Language changed to:', lang);
      this.updateTranslations();
    });

    this.subscriptions.push(langSub);

    // Инициализируем переводы
    this.updateTranslations();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadProjects(): void {
    console.log('Loading projects...');

    this.dataService.getData<any>('projects').subscribe({
      next: (data) => {
        console.log('Projects data loaded:', data);

        this.projects = data.projects || [];
        this.projectsLoaded = true;

        // Извлекаем категории
        const rawCategories = this.projects.map(p => p.category);
        const unique = Array.from(new Set(rawCategories));
        this.categories = unique.map(name => ({ name }));

        console.log('Categories:', this.categories);
        console.log('Projects count:', this.projects.length);

        // Обновляем переводы после загрузки проектов
        this.updateTranslations();
        this.filterProjects(this.selectedCategory);
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.projects = [];
        this.categories = [];
        this.filteredProjects = [];
      }
    });
  }

  private updateTranslations() {
    console.log('Updating translations...');

    // Безопасно получаем переводы
    this.sectionTitle = this.safeTranslate('PROJECTS_TITLE', 'My Projects');
    this.sectionSubtitle = this.safeTranslate('PROJECTS_SUBTITLE', 'A showcase of my work');

    console.log('Updated translations:', {
      title: this.sectionTitle,
      subtitle: this.sectionSubtitle
    });

    // Если проекты уже загружены, обновляем фильтр
    if (this.projectsLoaded) {
      this.filterProjects(this.selectedCategory);
    }
  }

  filterProjects(category: string): void {
    console.log('Filtering projects by category:', category);

    this.selectedCategory = category;
    this.filteredProjects = category === 'All'
      ? [...this.projects]
      : this.projects.filter(p => p.category === category);

    console.log('Filtered projects count:', this.filteredProjects.length);
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
    console.log('Getting project title:', title, 'for lang:', lang);
    return title;
  }

  // Метод для безопасного получения перевода
  safeTranslate(key: string, fallback: string = ''): string {
    const translation = this.translations.instant(key);
    const result = translation !== key ? translation : fallback;
    console.log(`SafeTranslate: ${key} -> ${result}`);
    return result;
  }
}
