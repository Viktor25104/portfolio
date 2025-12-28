import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangPipe } from '../../../../../pipes/lang-pipe';

@Component({
  selector: 'app-skill-modal-header',
  standalone: true,
  imports: [CommonModule, LangPipe],
  template: `
    <div class="skill-header">
      <div class="skill-meta">
        <span class="skill-category">{{ category }}</span>
        <span class="skill-level" [class]="levelClass">
          {{ level | uppercase | lang }}
        </span>
      </div>
      <h2 class="skill-title">{{ name }}</h2>
      <p class="skill-description">{{ description }}</p>
    </div>
  `,
  styles: [`
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

    @media (max-width: 768px) {
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
    }

    @media (max-width: 480px) {
      .skill-header {
        padding-right: 1.5rem;
      }

      .skill-title {
        font-size: 1.8rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .skill-title {
        animation: none;
        transition-duration: 0.1s;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillModalHeaderComponent {
  @Input() name = '';
  @Input() description = '';
  @Input() category = '';
  @Input() level = '';
  @Input() levelClass = '';
}
