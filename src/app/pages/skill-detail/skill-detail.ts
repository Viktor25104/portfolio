import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangPipe } from '../../core/pipes/lang-pipe';

interface Skill {
  id: string;
  name: string;
  description: string;
  level: string;
  experience: number;
  projects?: string[];
  category: string;
  color: string;
  keyPoints?: string[];
  tools?: string[];
}

@Component({
  selector: 'app-skill-modal',
  standalone: true,
  imports: [CommonModule, LangPipe],
  template: `
    <div class="modal-overlay" *ngIf="skill" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()" [style.--skill-color]="skill.color">
        <!-- Close Button -->
        <button class="close-btn" (click)="onClose()" aria-label="Close">×</button>

        <!-- Header -->
        <div class="skill-header">
          <div class="skill-meta">
            <span class="skill-category">{{ skill.category }}</span>
            <span class="skill-level" [class]="skill.level.toLowerCase()">
              {{ skill.level.toUpperCase() | lang }}
            </span>
          </div>
          <h2 class="skill-title">{{ skill.name }}</h2>
          <p class="skill-description">{{ skill.description }}</p>
        </div>

        <!-- Progress Bar -->
        <div class="skill-progress">
          <div class="progress-label">
            <span>{{ 'EXPERIENCE' | lang }}: {{ skill.experience }}+ {{ 'YEARS' | lang }}</span>
            <span class="percentage">{{ getSkillLevelPercentage(skill.level) }}%</span>
          </div>
          <div class="progress-track">
            <div
              class="progress-bar"
              [style.width.%]="getSkillLevelPercentage(skill.level)">
            </div>
          </div>
        </div>

        <!-- Content Grid -->
        <div class="content-grid">
          <!-- Key Points -->
          <div class="section" *ngIf="skill.keyPoints?.length">
            <h3>{{ 'KEY_STRENGTHS' | lang }}</h3>
            <ul class="points-list">
              <li *ngFor="let point of skill.keyPoints">{{ point }}</li>
            </ul>
          </div>

          <!-- Tools & Technologies -->
          <div class="section" *ngIf="skill.tools?.length">
            <h3>{{ 'TOOLS_USED' | lang }}</h3>
            <div class="tools-tags">
              <span *ngFor="let tool of skill.tools" class="tool-tag">{{ tool }}</span>
            </div>
          </div>

          <!-- Projects -->
          <div class="section" *ngIf="skill.projects?.length">
            <h3>{{ 'RECENT_PROJECTS' | lang }}</h3>
            <div class="project-tags">
              <span *ngFor="let project of skill.projects" class="project-tag">{{ project }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Epic Skill Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background:
        radial-gradient(circle at 30% 30%, rgba(76, 201, 240, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 70% 70%, rgba(58, 12, 163, 0.15) 0%, transparent 50%),
        rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(20px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 2rem;
      animation: modalFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes modalFadeIn {
      from {
        opacity: 0;
        backdrop-filter: blur(0px);
      }
      to {
        opacity: 1;
        backdrop-filter: blur(20px);
      }
    }

    .modal-content {
      background: linear-gradient(135deg, rgba(13, 27, 42, 0.98), rgba(20, 35, 55, 0.95));
      border: 2px solid var(--skill-color);
      border-radius: 25px;
      padding: 3rem;
      max-width: 700px;
      width: 100%;
      max-height: 85vh;
      overflow-y: auto;
      position: relative;
      animation: modalSlideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow:
        0 30px 80px rgba(0, 0, 0, 0.6),
        0 0 40px rgba(var(--skill-color-rgb, 76, 201, 240), 0.3);
      backdrop-filter: blur(20px);
    }

    @keyframes modalSlideUp {
      from {
        opacity: 0;
        transform: translateY(50px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }



    @keyframes borderGlow {
      0%, 100% {
        background-position: 0% 50%;
        opacity: 0.6;
      }
      50% {
        background-position: 100% 50%;
        opacity: 1;
      }
    }

    /* Scrollbar styling */
    .modal-content::-webkit-scrollbar {
      width: 6px;
    }

    .modal-content::-webkit-scrollbar-track {
      background: rgba(13, 27, 42, 0.3);
      border-radius: 3px;
      margin: 8px 0;
    }

    .modal-content::-webkit-scrollbar-thumb {
      background: linear-gradient(45deg, var(--skill-color), rgba(var(--skill-color-rgb, 76, 201, 240), 0.7));
      border-radius: 3px;
      border: 1px solid rgba(13, 27, 42, 0.5);
    }

    .modal-content::-webkit-scrollbar-thumb:hover {
      background: var(--skill-color);
      box-shadow: 0 0 8px rgba(var(--skill-color-rgb, 76, 201, 240), 0.5);
    }

    /* Enhanced Close Button */
    .close-btn {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      background: linear-gradient(135deg, rgba(13, 27, 42, 0.8), rgba(20, 35, 55, 0.7));
      border: 1px solid rgba(var(--skill-color-rgb, 76, 201, 240), 0.4);
      color: rgba(255, 255, 255, 0.8);
      font-size: 1.8rem;
      cursor: pointer;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 15px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 10;
      backdrop-filter: blur(10px);
      font-weight: 300;
    }

    .close-btn:hover {
      background: linear-gradient(135deg, var(--skill-color), rgba(var(--skill-color-rgb, 76, 201, 240), 0.8));
      color: white;
      transform: rotate(90deg) scale(1.1);
      box-shadow: 0 0 25px rgba(var(--skill-color-rgb, 76, 201, 240), 0.6);
      border-color: var(--skill-color);
    }

    /* Epic Skill Header */
    .skill-header {
      margin-bottom: 3rem;
      padding-right: 3rem;
      position: relative;
    }

    .skill-header::before {
      content: '';
      position: absolute;
      top: -20px;
      left: -20px;
      width: 80px;
      height: 80px;
      background: radial-gradient(circle, rgba(var(--skill-color-rgb, 76, 201, 240), 0.06) 0%, transparent 70%);
      border-radius: 50%;
      animation: headerFloat 6s ease-in-out infinite;
      z-index: -1;
      pointer-events: none;
    }

    @keyframes headerFloat {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      50% { transform: translate(20px, -20px) rotate(180deg); }
    }

    .skill-meta {
      display: flex;
      gap: 1.2rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      animation: slideInDown 0.6s ease-out 0.2s both;
    }

    @keyframes slideInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .skill-category, .skill-level {
      padding: 0.6rem 1.4rem;
      border-radius: 25px;
      font-size: 0.9rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .skill-category {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));
      color: rgba(255, 255, 255, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .skill-level {
      background: linear-gradient(135deg, rgba(var(--skill-color-rgb, 76, 201, 240), 0.25), rgba(var(--skill-color-rgb, 76, 201, 240), 0.15));
      color: var(--skill-color);
      border: 1px solid var(--skill-color);
      box-shadow: 0 0 15px rgba(var(--skill-color-rgb, 76, 201, 240), 0.3);
    }

    .skill-category:hover, .skill-level:hover {
      transform: translateY(-3px) scale(1.05);
    }

    /* Enhanced Skill Title */
    .skill-title {
      font-size: 2.5rem;
      font-weight: 900;
      margin-bottom: 1.5rem;
      background: linear-gradient(45deg, var(--skill-color), #ffffff, var(--skill-color));
      background-size: 200% 200%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: titleShimmer 3s ease-in-out infinite, titleGlow 2s ease-in-out infinite alternate;
      text-shadow: 0 0 30px rgba(var(--skill-color-rgb, 76, 201, 240), 0.3);
      position: relative;
    }

    @keyframes titleShimmer {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    @keyframes titleGlow {
      from { filter: drop-shadow(0 0 15px rgba(var(--skill-color-rgb, 76, 201, 240), 0.3)); }
      to { filter: drop-shadow(0 0 30px rgba(var(--skill-color-rgb, 76, 201, 240), 0.6)); }
    }

    .skill-description {
      color: rgba(255, 255, 255, 0.85);
      line-height: 1.7;
      font-size: 1.1rem;
      animation: fadeIn 0.8s ease-out 0.4s both;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* Epic Progress Section */
    .skill-progress {
      margin-bottom: 3rem;
      padding: 2rem;
      background: linear-gradient(135deg, rgba(var(--skill-color-rgb, 76, 201, 240), 0.05), rgba(var(--skill-color-rgb, 58, 12, 163), 0.03));
      border-radius: 20px;
      border: 1px solid rgba(var(--skill-color-rgb, 76, 201, 240), 0.2);
      animation: slideInLeft 0.8s ease-out 0.6s both;
    }

    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .progress-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      font-size: 1rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
    }

    .progress-label span:first-child {
      color: rgba(255, 255, 255, 0.8);
    }

    .percentage {
      color: var(--skill-color);
      font-weight: 800;
      font-size: 1.2rem;
      text-shadow: 0 0 10px rgba(var(--skill-color-rgb, 76, 201, 240), 0.5);
    }

    .progress-track {
      height: 12px;
      background: linear-gradient(90deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
      border-radius: 6px;
      overflow: hidden;
      position: relative;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--skill-color), rgba(var(--skill-color-rgb, 76, 201, 240), 0.8));
      border-radius: 6px;
      transition: width 2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow:
        0 0 20px rgba(var(--skill-color-rgb, 76, 201, 240), 0.6),
        inset 0 1px 2px rgba(255, 255, 255, 0.3);
      position: relative;
      overflow: hidden;
    }

    .progress-bar::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      animation: progressShimmer 2s ease-in-out infinite;
    }

    @keyframes progressShimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    /* Enhanced Content Grid */
    .content-grid {
      display: grid;
      gap: 2.5rem;
      animation: fadeInUp 1s ease-out 0.8s both;
      padding-right: 2px; /* Prevent content from touching scrollbar */
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .section {
      padding: 2rem;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(var(--skill-color-rgb, 76, 201, 240), 0.03));
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .section::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--skill-color), transparent);
      transition: left 0.8s ease;
    }

    .section:hover::before {
      left: 100%;
    }

    .section:hover {
      transform: translateY(-5px);
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(var(--skill-color-rgb, 76, 201, 240), 0.06));
      border-color: rgba(var(--skill-color-rgb, 76, 201, 240), 0.3);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
    }

    .section h3 {
      color: var(--skill-color);
      font-size: 1.3rem;
      font-weight: 800;
      margin-bottom: 1.5rem;
      border-bottom: 2px solid rgba(var(--skill-color-rgb, 76, 201, 240), 0.3);
      padding-bottom: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      position: relative;
    }

    .section h3::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 50px;
      height: 2px;
      background: var(--skill-color);
      box-shadow: 0 0 10px rgba(var(--skill-color-rgb, 76, 201, 240), 0.6);
    }

    /* Enhanced Points List */
    .points-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .points-list li {
      padding: 1rem 0;
      color: rgba(255, 255, 255, 0.9);
      border-left: 3px solid var(--skill-color);
      padding-left: 1.5rem;
      margin-bottom: 1rem;
      font-size: 1rem;
      line-height: 1.6;
      position: relative;
      background: linear-gradient(90deg, rgba(var(--skill-color-rgb, 76, 201, 240), 0.05), transparent);
      border-radius: 0 10px 10px 0;
      transition: all 0.3s ease;
    }

    .points-list li::before {
      content: '▶';
      position: absolute;
      left: -8px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--skill-color);
      font-size: 0.8rem;
      background: rgba(13, 27, 42, 0.9);
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      border: 2px solid var(--skill-color);
    }

    .points-list li:hover {
      background: linear-gradient(90deg, rgba(var(--skill-color-rgb, 76, 201, 240), 0.1), transparent);
      transform: translateX(10px);
    }

    /* Enhanced Tags */
    .tools-tags, .project-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8rem;
    }

    .tool-tag, .project-tag {
      padding: 0.6rem 1.2rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(10px);
      position: relative;
      overflow: hidden;
    }

    .tool-tag::before, .project-tag::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.6s ease;
    }

    .tool-tag:hover::before, .project-tag:hover::before {
      left: 100%;
    }

    .tool-tag {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06));
      color: rgba(255, 255, 255, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.25);
    }

    .project-tag {
      background: linear-gradient(135deg, rgba(var(--skill-color-rgb, 76, 201, 240), 0.15), rgba(var(--skill-color-rgb, 76, 201, 240), 0.08));
      color: var(--skill-color);
      border: 1px solid rgba(var(--skill-color-rgb, 76, 201, 240), 0.4);
      box-shadow: 0 0 10px rgba(var(--skill-color-rgb, 76, 201, 240), 0.2);
    }

    .tool-tag:hover, .project-tag:hover {
      transform: translateY(-5px) scale(1.05) rotate(2deg);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }

    .project-tag:hover {
      background: linear-gradient(135deg, rgba(var(--skill-color-rgb, 76, 201, 240), 0.25), rgba(var(--skill-color-rgb, 76, 201, 240), 0.15));
      box-shadow: 0 0 20px rgba(var(--skill-color-rgb, 76, 201, 240), 0.4);
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .modal-overlay {
        padding: 1rem;
      }

      .modal-content {
        padding: 2rem;
        max-height: 90vh;
        border-radius: 20px;
      }

      .skill-header {
        padding-right: 2rem;
      }

      .skill-title {
        font-size: 2rem;
      }

      .skill-meta {
        flex-direction: column;
        gap: 0.8rem;
      }

      .skill-category, .skill-level {
        padding: 0.5rem 1.2rem;
        font-size: 0.85rem;
      }

      .progress-track {
        height: 10px;
      }

      .section {
        padding: 1.5rem;
      }

      .section h3 {
        font-size: 1.2rem;
      }

      .points-list li {
        padding: 0.8rem 0;
        padding-left: 1.2rem;
        font-size: 0.95rem;
      }

      .tool-tag, .project-tag {
        padding: 0.5rem 1rem;
        font-size: 0.85rem;
      }

      .close-btn {
        width: 45px;
        height: 45px;
        font-size: 1.6rem;
      }

      .content-grid {
        padding-right: 4px; /* More space for mobile scrollbar */
      }
    }

    @media (max-width: 480px) {
      .modal-content {
        padding: 1.5rem;
      }

      .skill-header {
        padding-right: 1.5rem;
      }

      .skill-title {
        font-size: 1.8rem;
      }

      .skill-progress {
        padding: 1.5rem;
      }

      .progress-label {
        font-size: 0.9rem;
      }

      .percentage {
        font-size: 1.1rem;
      }

      .section {
        padding: 1.2rem;
      }

      .tools-tags, .project-tags {
        gap: 0.6rem;
      }

      .tool-tag, .project-tag {
        padding: 0.4rem 0.8rem;
        font-size: 0.8rem;
      }

      .content-grid {
        padding-right: 6px; /* Even more space for small mobile scrollbar */
      }
    }

    /* Performance optimizations */
    .modal-content,
    .section,
    .tool-tag,
    .project-tag,
    .points-list li {
      will-change: transform;
    }

    .skill-title,
    .progress-bar {
      will-change: filter, background-position;
    }

    /* Dark mode enhancements */
    @media (prefers-color-scheme: dark) {
      .modal-content {
        background: linear-gradient(135deg, rgba(13, 27, 42, 0.99), rgba(20, 35, 55, 0.98));
      }

      .skill-description {
        color: rgba(255, 255, 255, 0.9);
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .modal-content,
      .skill-title,
      .progress-bar,
      .section,
      .tool-tag,
      .project-tag {
        animation: none;
        transition-duration: 0.1s;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillModalComponent implements OnChanges {
  @Input() skill: Skill | null = null;
  @Output() close = new EventEmitter<void>();

  ngOnChanges() {
    if (this.skill) {
      // Предотвращаем скролл фона
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  onClose() {
    document.body.style.overflow = 'auto';
    this.close.emit();
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
}
