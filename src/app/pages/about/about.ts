import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DataService } from '../../core/services/data.service';
import { TranslationsService } from '../../core/services/translations.service';
import { LangPipe } from '../../core/pipes/lang-pipe';
import { TimelineEntry } from '../../core/models/biography.model';

gsap.registerPlugin(ScrollTrigger);

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

  constructor(
    public translations: TranslationsService,
    private cdr: ChangeDetectorRef,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.isVisible = true;
    this.currentLang = this.translations.getCurrentLang();
    this.loadTimeline();

    const langSub = this.translations.currentLang$.subscribe(lang => {
      this.currentLang = lang;
      this.loadTimeline();
    });
    this.subscriptions.push(langSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngAfterViewInit() {
    setTimeout(() => this.initializeAnimations(), 500);
  }

  private loadTimeline() {
    this.dataService.getData<any>('career').subscribe({
      next: (data) => {
        this.translatedTimeline = data.timeline;
        this.cdr.detectChanges();
        setTimeout(() => this.initializeAnimations(), 100);
      },
      error: (error) => {
        console.error('Error loading timeline:', error);
      }
    });
  }

  private initializeAnimations() {
    if (this.timelineRef?.nativeElement?.children.length > 0) {
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
    }
  }

  getText(obj: any): string {
    return typeof obj === 'string' ? obj : obj?.[this.currentLang] || '';
  }

}
