import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Signal,
  effect,
  ViewChild
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { DataService } from '../../core/services/data.service';
import { TranslationsService } from '../../core/services/translations.service';
import { LangPipe } from '../../core/pipes/lang-pipe';
import { TimelineEntry } from '../../core/models/biography.model';
import { loadGsap } from '../../shared/animations/gsap-loader';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, LangPipe],
  templateUrl: './about.html',
  styleUrls: ['./about.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class About implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('timelineRef') timelineRef!: ElementRef;
  isVisible = false;
  translatedTimeline: TimelineEntry[] = [];
  currentLang: string = '';
  private subscriptions: Subscription[] = [];
  private careerSignal?: Signal<any | null>;

  constructor(
    public translations: TranslationsService,
    private cdr: ChangeDetectorRef,
    private dataService: DataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.isVisible = true;
    this.currentLang = this.translations.getCurrentLang();
    this.careerSignal = this.dataService.getData<any>('career');
    effect(() => {
      const data = this.careerSignal?.();
      if (!data) {
        return;
      }

      this.translatedTimeline = data.timeline;
      this.cdr.detectChanges();
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => this.initializeAnimations(), 100);
      }
    });

    const langSub = this.translations.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });
    this.subscriptions.push(langSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    setTimeout(() => this.initializeAnimations(), 500);
  }

  private initializeAnimations() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.timelineRef?.nativeElement?.children.length > 0) {
      loadGsap()
        .then(({ gsap, ScrollTrigger }) => {
          gsap.registerPlugin(ScrollTrigger);
          gsap.fromTo(this.timelineRef.nativeElement.children,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.2,
              duration: 0.8,
              scrollTrigger: {
                trigger: this.timelineRef.nativeElement,
                start: 'top center+=100',
                toggleActions: 'play none none reverse'
              }
            }
          );
        })
        .catch((error) => {
          console.error('Failed to load GSAP:', error);
        });
    }
  }

  getText(obj: any): string {
    return typeof obj === 'string' ? obj : obj?.[this.currentLang] || '';
  }

}
