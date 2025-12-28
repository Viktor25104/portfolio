import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangPipe } from '../../../../core/pipes/lang-pipe';

@Component({
  selector: 'app-skill-detail-content',
  standalone: true,
  imports: [CommonModule, LangPipe],
  template: `
    <div class="content-grid">
      <div class="section" *ngIf="keyPoints?.length">
        <h3>{{ 'KEY_STRENGTHS' | lang }}</h3>
        <ul class="points-list">
          <li *ngFor="let point of keyPoints">{{ point }}</li>
        </ul>
      </div>

      <div class="section" *ngIf="tools?.length">
        <h3>{{ 'TOOLS_USED' | lang }}</h3>
        <div class="tools-tags">
          <span *ngFor="let tool of tools" class="tool-tag">{{ tool }}</span>
        </div>
      </div>

      <div class="section" *ngIf="projects?.length">
        <h3>{{ 'RECENT_PROJECTS' | lang }}</h3>
        <div class="project-tags">
          <span *ngFor="let project of projects" class="project-tag">{{ project }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .content-grid {
      display: grid;
      gap: 2.5rem;
      animation: fadeInUp 1s ease-out 0.8s both;
      padding-right: 2px;
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

    @media (max-width: 768px) {
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

      .content-grid {
        padding-right: 4px;
      }
    }

    @media (max-width: 480px) {
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
        padding-right: 6px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .section,
      .tool-tag,
      .project-tag,
      .points-list li {
        animation: none;
        transition-duration: 0.1s;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillDetailContentComponent {
  @Input() keyPoints?: string[];
  @Input() tools?: string[];
  @Input() projects?: string[];
}
