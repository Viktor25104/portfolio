import { ChangeDetectionStrategy, Component, OnDestroy, Signal, computed, effect, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { DataService } from '../../../../infrastructure/http/data.service';
import { TranslationsService } from '../../../../infrastructure/http/translations.service';
import { SeoService } from '../../../seo/seo.service';
import { LangPipe } from '../../../pipes/lang-pipe';
import { ProjectTechStackComponent } from '../project-detail/components/project-tech-stack/project-tech-stack';
import { ProjectLinksComponent } from '../project-detail/components/project-links/project-links';
import { Project } from '../project-detail/project-detail.types';

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgOptimizedImage,
    LangPipe,
    ProjectTechStackComponent,
    ProjectLinksComponent
  ],
  templateUrl: './project-page.html',
  styleUrl: './project-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectPage implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly dataService = inject(DataService);
  private readonly translationsService = inject(TranslationsService);
  private readonly seo = inject(SeoService);

  private readonly projectsSignal = this.dataService.getData<any>('projects');
  private readonly paramsSignal = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  private readonly currentLangSignal = toSignal(this.translationsService.currentLang$, {
    initialValue: this.translationsService.getCurrentLang()
  });

  readonly project = computed<Project | null>(() => {
    const data = this.projectsSignal();
    const id = this.paramsSignal()?.get('id') || '';
    if (!data?.projects?.length) {
      return null;
    }

    return data.projects.find((item: Project) => item.id === id) || null;
  });

  readonly projectImage = computed<string | null>(() => {
    const item = this.project();
    return item?.images?.[0] || item?.thumbnail || null;
  });

  readonly notFound = computed<boolean>(() => {
    const data = this.projectsSignal();
    if (!data) {
      return false;
    }

    return !this.project();
  });

  private readonly destroySignal = signal(false);
  public readonly translations = this.translationsService;

  constructor() {
    effect(() => {
      if (this.destroySignal()) {
        return;
      }

      const item = this.project();
      const lang = this.currentLangSignal();
      if (!item) {
        return;
      }

      const title = this.getProjectTitle(item);
      const description = this.getProjectDescription(item);
      const url = `/${lang}/project/${item.id}`;
      const image = this.projectImage() || undefined;

      this.seo.updateMetaTags({
        lang,
        title,
        description,
        image,
        url
      });

      this.seo.setJsonLd('project', this.buildProjectJsonLd(item, lang, url, image));
      this.seo.setJsonLd('breadcrumbs', this.buildBreadcrumbsJsonLd(item, lang, url));
    });
  }

  ngOnDestroy(): void {
    this.destroySignal.set(true);
    this.seo.removeJsonLd('project');
    this.seo.removeJsonLd('breadcrumbs');
  }

  getProjectTitle(project: Project): string {
    const lang = this.translationsService.getCurrentLang();
    return project.title?.[lang] || project.title?.['en'] || project.title || '';
  }

  getProjectDescription(project: Project): string {
    const lang = this.translationsService.getCurrentLang();
    return project.description?.[lang] || project.description?.['en'] || project.description || '';
  }

  getProjectRole(project: Project): string {
    const lang = this.translationsService.getCurrentLang();
    return project.role?.[lang] || project.role?.['en'] || project.role || '';
  }

  getTranslatedText(value: any): string {
    if (typeof value === 'string') {
      return value;
    }

    const lang = this.translationsService.getCurrentLang();
    return value?.[lang] || value?.['en'] || value || '';
  }

  getCategoryTranslationKey(category: string): string {
    const mapping: Record<string, string> = {
      Web: 'WEB_DEVELOPMENT',
      Mobile: 'MOBILE_APPS',
      Games: 'GAMES',
      Blockchain: 'BLOCKCHAIN',
      Cybersecurity: 'CYBERSECURITY'
    };
    return mapping[category] || category;
  }

  private buildProjectJsonLd(project: Project, lang: string, url: string, image?: string): object {
    const techStack = [
      ...(project.techStack?.frontend || []),
      ...(project.techStack?.backend || []),
      ...(project.techStack?.other || [])
    ];

    return {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: this.getProjectTitle(project),
      description: this.getProjectDescription(project),
      inLanguage: lang,
      url,
      image: image ? [image] : undefined,
      keywords: techStack.length ? techStack.join(', ') : undefined
    };
  }

  private buildBreadcrumbsJsonLd(project: Project, lang: string, url: string): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: this.translationsService.instant('HOME_LABEL') || 'Home',
          item: `/${lang}`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: this.translationsService.instant('PROJECTS_TITLE') || 'Projects',
          item: `/${lang}#projects`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: this.getProjectTitle(project),
          item: url
        }
      ]
    };
  }
}
