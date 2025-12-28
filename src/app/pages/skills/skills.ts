import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LangPipe } from '../../core/pipes/lang-pipe';
import { DataService } from '../../core/services/data.service';
import { TranslationsService } from '../../core/services/translations.service';
import { SkillModalComponent } from '../skill-detail/skill-detail';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, LangPipe, SkillModalComponent],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Skills implements OnInit, OnDestroy {
  sectionTitle = '';
  sectionSubtitle = '';
  selectedCategory = 'All';
  selectedSkill: any = null;
  categories: { name: string; color: string }[] = [];
  skills: any[] = [];
  filteredSkills: any[] = [];

  private animationInitialized = false;
  private subscriptions: Subscription[] = [];

  constructor(
    public translations: TranslationsService,
    private dataService: DataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.loadSkills();
    if (isPlatformBrowser(this.platformId)) {
      this.initializeAnimations();
    }

    const langSub = this.translations.currentLang$.subscribe(() => {
      this.updateTranslations();
    });
    this.subscriptions.push(langSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadSkills() {
    this.dataService.getData<any>('skills').subscribe({
      next: (data) => {
        this.skills = data.skills;
        this.extractCategories();
        this.updateTranslations(data);
      },
      error: (err) => {
        console.error('Error loading skills:', err);
      }
    });
  }

  private updateTranslations(dataOverride?: any) {
    const data = dataOverride || { skills: this.skills };
    const lang = this.translations.getCurrentLang();

    this.sectionTitle = data.sectionTitle?.[lang] || '';
    this.sectionSubtitle = data.sectionSubtitle?.[lang] || '';

    this.skills = this.skills.map(skill => ({
      ...skill,
      description: skill.description?.[lang] || skill.description
    }));

    this.filterSkills(this.selectedCategory);
  }

  private extractCategories() {
    const rawCategories = this.skills.map(s => s.category);
    const unique = Array.from(new Set(rawCategories));
    this.categories = unique.map(name => {
      const color = this.skills.find(s => s.category === name)?.color || '#ccc';
      return { name, color };
    });
  }

  filterSkills(category: string): void {
    this.selectedCategory = category;
    this.filteredSkills = [];
    setTimeout(() => {
      this.filteredSkills = category === 'All'
        ? [...this.skills]
        : this.skills.filter(s => s.category === category);
    }, 0);
  }

  viewSkillDetail(skill: any) {
    this.selectedSkill = skill;
  }

  closeSkillModal() {
    this.selectedSkill = null;
  }

  getSkillLevelPercentage(level: string): number {
    switch (level) {
      case 'Expert': return 100;
      case 'Advanced': return 80;
      case 'Intermediate': return 60;
      case 'Basic': return 30;
      default: return 0;
    }
  }

  getCategoryColor(category: string): string {
    return this.categories.find(c => c.name === category)?.color || '#ccc';
  }

  trackBySkillId(index: number, skill: any): string {
    return skill.id;
  }

  getCategoryTranslationKey(category: string): string {
    const mapping: Record<string, string> = {
      'All': 'ALL_SKILLS',
      'Programming': 'PROGRAMMING',
      'Frameworks': 'FRAMEWORKS',
      'Tools': 'TOOLS',
      'Cybersecurity': 'CYBERSECURITY',
      'Soft Skills': 'SOFT_SKILLS'
    };
    return mapping[category] || category.toUpperCase();
  }

  private initializeAnimations(): void {
    if (!isPlatformBrowser(this.platformId) || this.animationInitialized) return;

    setTimeout(() => {
      gsap.fromTo('.skill-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.5
        }
      );
      this.animationInitialized = true;
    }, 50);
  }
}
