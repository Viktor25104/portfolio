import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangPipe } from '../../../../../pipes/lang-pipe';

@Component({
  selector: 'app-project-modal-header',
  standalone: true,
  imports: [CommonModule, LangPipe],
  template: `
    <div class="project-header">
      <h2 class="project-title">{{ title }}</h2>
      <div class="project-meta">
        <span class="project-category">{{ categoryKey | lang }}</span>
        <span class="project-role" *ngIf="role">{{ role }}</span>
        <span class="project-duration" *ngIf="duration">{{ duration }}</span>
      </div>
      <p class="project-description" *ngIf="description">{{ description }}</p>
    </div>
  `,
  styles: [`
    @keyframes slideInDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .project-header {
      margin-bottom: 3rem;
      padding-right: 4rem;
      position: relative;
      animation: slideInDown 0.6s ease-out 0.2s both;
    }

    .project-title {
      font-size: 2.8rem;
      font-weight: 900;
      margin-bottom: 1.5rem;
      background: linear-gradient(45deg, var(--color-neon-blue), var(--color-purple), #ffffff, var(--color-neon-blue));
      background-size: 300% 300%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: titleShimmer 4s ease-in-out infinite, titleGlow 2s ease-in-out infinite alternate;
      text-shadow: 0 0 30px rgba(76, 201, 240, 0.3);
      position: relative;
    }

    @keyframes titleShimmer {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    @keyframes titleGlow {
      from { filter: drop-shadow(0 0 20px rgba(76, 201, 240, 0.3)); }
      to { filter: drop-shadow(0 0 40px rgba(76, 201, 240, 0.6)); }
    }

    .project-meta {
      display: flex;
      gap: 1.2rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      animation: slideInLeft 0.6s ease-out 0.4s both;
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

    .project-category, .project-role, .project-duration {
      padding: 0.6rem 1.4rem;
      border-radius: 25px;
      font-size: 0.9rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(10px);
    }

    .project-category {
      background: linear-gradient(135deg, rgba(76, 201, 240, 0.2), rgba(76, 201, 240, 0.1));
      color: var(--color-neon-blue);
      border: 1px solid var(--color-neon-blue);
      box-shadow: 0 0 15px rgba(76, 201, 240, 0.3);
    }

    .project-role, .project-duration {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));
      color: rgba(255, 255, 255, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .project-category:hover, .project-role:hover, .project-duration:hover {
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }

    .project-description {
      color: rgba(255, 255, 255, 0.85);
      line-height: 1.7;
      font-size: 1.1rem;
      animation: fadeIn 0.8s ease-out 0.6s both;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @media (max-width: 768px) {
      .project-header {
        padding-right: 2rem;
      }

      .project-title {
        font-size: 2.2rem;
      }

      .project-meta {
        flex-direction: column;
        gap: 0.8rem;
      }

      .project-category, .project-role, .project-duration {
        padding: 0.5rem 1.2rem;
        font-size: 0.85rem;
      }
    }

    @media (max-width: 480px) {
      .project-header {
        padding-right: 1.5rem;
      }

      .project-title {
        font-size: 2rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .project-title {
        animation: none;
        transition-duration: 0.1s;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectModalHeaderComponent {
  @Input() title = '';
  @Input() categoryKey = '';
  @Input() role?: string;
  @Input() duration?: string;
  @Input() description?: string;
}
