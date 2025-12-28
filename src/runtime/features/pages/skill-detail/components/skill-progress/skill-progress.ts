import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangPipe } from '../../../../../pipes/lang-pipe';

@Component({
  selector: 'app-skill-progress',
  standalone: true,
  imports: [CommonModule, LangPipe],
  template: `
    <div class="skill-progress">
      <div class="progress-label">
        <span>{{ 'EXPERIENCE' | lang }}: {{ experience }}+ {{ 'YEARS' | lang }}</span>
        <span class="percentage">{{ levelPercentage }}%</span>
      </div>
      <div class="progress-track">
        <div
          class="progress-bar"
          [style.width.%]="levelPercentage">
        </div>
      </div>
    </div>
  `,
  styles: [`
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

    @media (max-width: 768px) {
      .progress-track {
        height: 10px;
      }
    }

    @media (max-width: 480px) {
      .skill-progress {
        padding: 1.5rem;
      }

      .progress-label {
        font-size: 0.9rem;
      }

      .percentage {
        font-size: 1.1rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .progress-bar {
        animation: none;
        transition-duration: 0.1s;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillProgressComponent {
  @Input() experience = 0;
  @Input() level = '';

  get levelPercentage(): number {
    switch (this.level) {
      case 'Expert':
        return 100;
      case 'Advanced':
        return 80;
      case 'Intermediate':
        return 60;
      case 'Basic':
        return 30;
      default:
        return 0;
    }
  }
}
