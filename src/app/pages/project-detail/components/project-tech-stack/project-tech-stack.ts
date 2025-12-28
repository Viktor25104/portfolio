import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangPipe } from '../../../../core/pipes/lang-pipe';
import { ProjectTechStack } from '../../project-detail.types';

@Component({
  selector: 'app-project-tech-stack',
  standalone: true,
  imports: [CommonModule, LangPipe],
  template: `
    <h3>{{ 'TECHNOLOGIES_USED' | lang }}</h3>
    <div class="tech-categories">
      <div class="tech-category" *ngIf="techStack?.frontend?.length">
        <h4>{{ 'FRONTEND' | lang }}</h4>
        <div class="tech-tags">
          <span *ngFor="let tech of techStack?.frontend" class="tech-tag frontend">{{ tech }}</span>
        </div>
      </div>
      <div class="tech-category" *ngIf="techStack?.backend?.length">
        <h4>{{ 'BACKEND' | lang }}</h4>
        <div class="tech-tags">
          <span *ngFor="let tech of techStack?.backend" class="tech-tag backend">{{ tech }}</span>
        </div>
      </div>
      <div class="tech-category" *ngIf="techStack?.other?.length">
        <h4>{{ 'OTHER_TOOLS' | lang }}</h4>
        <div class="tech-tags">
          <span *ngFor="let tech of techStack?.other" class="tech-tag other">{{ tech }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    h3 {
      color: var(--color-neon-blue);
      font-size: 1.4rem;
      font-weight: 800;
      margin-bottom: 1.5rem;
      border-bottom: 2px solid rgba(76, 201, 240, 0.3);
      padding-bottom: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      position: relative;
    }

    h3::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 60px;
      height: 2px;
      background: linear-gradient(90deg, var(--color-neon-blue), var(--color-purple));
      box-shadow: 0 0 10px rgba(76, 201, 240, 0.6);
    }

    .tech-categories {
      display: grid;
      gap: 2rem;
    }

    .tech-category h4 {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, rgba(76, 201, 240, 0.1), rgba(58, 12, 163, 0.05));
      border-radius: 10px;
      border-left: 3px solid var(--color-neon-blue);
    }

    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8rem;
      margin-bottom: 1.5rem;
    }

    .tech-tag {
      padding: 0.6rem 1.2rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid;
      backdrop-filter: blur(10px);
      position: relative;
      overflow: hidden;
    }

    .tech-tag::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.6s ease;
    }

    .tech-tag:hover::before {
      left: 100%;
    }

    .tech-tag.frontend {
      background: linear-gradient(135deg, rgba(76, 201, 240, 0.15), rgba(76, 201, 240, 0.08));
      color: var(--color-neon-blue);
      border-color: var(--color-neon-blue);
      box-shadow: 0 0 10px rgba(76, 201, 240, 0.2);
    }

    .tech-tag.backend {
      background: linear-gradient(135deg, rgba(58, 12, 163, 0.25), rgba(58, 12, 163, 0.12));
      color: var(--color-purple);
      border-color: var(--color-purple);
      box-shadow: 0 0 10px rgba(58, 12, 163, 0.3);
    }

    .tech-tag.other {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06));
      color: rgba(255, 255, 255, 0.95);
      border-color: rgba(255, 255, 255, 0.25);
    }

    .tech-tag:hover {
      transform: translateY(-5px) scale(1.05) rotate(2deg);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }

    .tech-tag.frontend:hover {
      box-shadow: 0 0 20px rgba(76, 201, 240, 0.4);
    }

    .tech-tag.backend:hover {
      box-shadow: 0 0 20px rgba(58, 12, 163, 0.5);
    }

    @media (max-width: 768px) {
      h3 {
        font-size: 1.2rem;
      }

      .tech-category h4 {
        font-size: 0.9rem;
      }

      .tech-tags {
        gap: 0.6rem;
      }

      .tech-tag {
        padding: 0.5rem 1rem;
        font-size: 0.85rem;
      }
    }

    @media (max-width: 480px) {
      .tech-tags {
        gap: 0.5rem;
      }

      .tech-tag {
        padding: 0.4rem 0.8rem;
        font-size: 0.8rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .tech-tag {
        animation: none;
        transition-duration: 0.1s;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectTechStackComponent {
  @Input() techStack?: ProjectTechStack;
}
