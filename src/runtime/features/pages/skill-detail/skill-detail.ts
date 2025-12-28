import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { ScrollLockService } from '../../../state/scroll-lock.service';
import { ModalShellComponent } from '../project-detail/components/modal-shell/modal-shell';
import { SkillModalHeaderComponent } from './components/skill-modal-header/skill-modal-header';
import { SkillProgressComponent } from './components/skill-progress/skill-progress';
import { SkillDetailContentComponent } from './components/skill-detail-content/skill-detail-content';
import { Skill } from './skill-detail.types';

@Component({
  selector: 'app-skill-modal',
  standalone: true,
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule,
    ModalShellComponent,
    SkillModalHeaderComponent,
    SkillProgressComponent,
    SkillDetailContentComponent
  ],
  template: `
    <ng-template cdk-portal>
      <app-modal-shell
        *ngIf="skill"
        (close)="onClose()"
        [style.--modal-accent-color]="skill.color"
        [style.--modal-accent-rgb]="skillColorRgb"
        [style.--modal-overlay-base]="'rgba(0, 0, 0, 0.85)'"
        [style.--skill-color]="skill.color"
        [style.--skill-color-rgb]="skillColorRgb">
        <app-skill-modal-header
          [name]="skill.name"
          [description]="skill.description"
          [category]="skill.category"
          [level]="skill.level"
          [levelClass]="skill.level.toLowerCase()">
        </app-skill-modal-header>

        @defer (on idle) {
          <app-skill-progress
            [experience]="skill.experience"
            [level]="skill.level">
          </app-skill-progress>

          <app-skill-detail-content
            [keyPoints]="skill.keyPoints"
            [tools]="skill.tools"
            [projects]="skill.projects">
          </app-skill-detail-content>
        } @placeholder {
          <div class="content-placeholder"></div>
        }
      </app-modal-shell>
    </ng-template>
  `,
  styles: [
    `
      .content-placeholder {
        height: 120px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillModalComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() skill: Skill | null = null;
  @Output() close = new EventEmitter<void>();

  @ViewChild(CdkPortal) modalPortal?: CdkPortal;

  skillColorRgb = '76, 201, 240';

  private overlayRef: OverlayRef | null = null;
  private pendingOpen = false;

  constructor(
    private overlay: Overlay,
    private scrollLock: ScrollLockService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnChanges(): void {
    if (this.skill?.color) {
      this.skillColorRgb = this.hexToRgb(this.skill.color) || this.skillColorRgb;
    }

    if (this.skill) {
      this.openOverlay();
    } else {
      this.closeOverlay();
    }
  }

  ngAfterViewInit(): void {
    if (this.pendingOpen) {
      this.openOverlay();
    }
  }

  ngOnDestroy(): void {
    this.closeOverlay();
    this.overlayRef?.dispose();
  }

  onClose(): void {
    this.closeOverlay();
    this.close.emit();
  }

  private openOverlay(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.modalPortal) {
      this.pendingOpen = true;
      return;
    }

    this.pendingOpen = false;
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
        scrollStrategy: this.overlay.scrollStrategies.block()
      });
    }

    if (!this.overlayRef.hasAttached()) {
      this.overlayRef.attach(this.modalPortal);
    }
    this.scrollLock.lock();
  }

  private closeOverlay(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
    this.scrollLock.unlock();
  }

  private hexToRgb(value: string): string | null {
    const hex = value.replace('#', '').trim();
    if (!hex) {
      return null;
    }

    const normalized = hex.length === 3
      ? hex.split('').map((char) => `${char}${char}`).join('')
      : hex;

    if (normalized.length !== 6) {
      return null;
    }

    const r = Number.parseInt(normalized.slice(0, 2), 16);
    const g = Number.parseInt(normalized.slice(2, 4), 16);
    const b = Number.parseInt(normalized.slice(4, 6), 16);

    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
      return null;
    }

    return `${r}, ${g}, ${b}`;
  }
}
