import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangPipe } from '../../../../../pipes/lang-pipe';
import { ProjectLink } from '../../project-detail.types';

@Component({
  selector: 'app-project-links',
  standalone: true,
  imports: [CommonModule, LangPipe],
  template: `
    <div class="project-links" *ngIf="links">
      <div class="links-container">
        <a *ngIf="links.github"
           [href]="links.github"
           target="_blank"
           rel="noopener noreferrer"
           class="link-btn github">
          <span class="link-icon">⚡</span>
          {{ 'VIEW_CODE' | lang }}
        </a>
        <a *ngIf="links.demo"
           [href]="links.demo"
           target="_blank"
           rel="noopener noreferrer"
           class="link-btn demo">
          <span class="link-icon">🚀</span>
          {{ 'LIVE_DEMO' | lang }}
        </a>
        <a *ngFor="let link of links.additional"
           [href]="link.url"
           target="_blank"
           rel="noopener noreferrer"
           class="link-btn additional">
          <span class="link-icon">🔗</span>
          {{ link.label }}
        </a>
      </div>
    </div>
  `,
  styles: [`
    .project-links {
      border-top: 2px solid rgba(255, 255, 255, 0.1);
      padding-top: 2rem;
      margin-bottom: 2rem;
      animation: slideInUp 0.8s ease-out 1.2s both;
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .links-container {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      justify-content: center;
    }

    .link-btn {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 1rem 2rem;
      border-radius: 25px;
      text-decoration: none;
      color: white;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      font-weight: 600;
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      backdrop-filter: blur(10px);
      position: relative;
      overflow: hidden;
    }

    .link-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.6s ease;
    }

    .link-btn:hover::before {
      left: 100%;
    }

    .link-btn.github {
      background: linear-gradient(135deg, #24292e, #1a1e22);
      border: 1px solid #444;
      box-shadow: 0 0 20px rgba(36, 41, 46, 0.5);
    }

    .link-btn.demo {
      background: linear-gradient(135deg, var(--color-purple), var(--color-neon-blue));
      border: 1px solid var(--color-neon-blue);
      box-shadow: 0 0 20px rgba(76, 201, 240, 0.4);
    }

    .link-btn.additional {
      background: linear-gradient(135deg, rgba(76, 201, 240, 0.2), rgba(76, 201, 240, 0.1));
      border: 1px solid var(--color-neon-blue);
      color: var(--color-neon-blue);
      box-shadow: 0 0 15px rgba(76, 201, 240, 0.3);
    }

    .link-btn:hover {
      transform: translateY(-5px) scale(1.05);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
    }

    .link-btn.github:hover {
      box-shadow: 0 0 30px rgba(76, 201, 240, 0.4);
    }

    .link-btn.demo:hover {
      box-shadow: 0 0 30px rgba(76, 201, 240, 0.6);
    }

    .link-btn.additional:hover {
      background: linear-gradient(135deg, rgba(76, 201, 240, 0.3), rgba(76, 201, 240, 0.2));
      color: white;
    }

    .link-icon {
      font-size: 1.2rem;
      filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
    }

    @media (max-width: 768px) {
      .links-container {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }

      .link-btn {
        padding: 0.9rem 1.8rem;
        font-size: 0.9rem;
        min-width: 200px;
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .link-btn {
        padding: 0.8rem 1.5rem;
        font-size: 0.85rem;
        min-width: 180px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .link-btn {
        animation: none;
        transition-duration: 0.1s;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectLinksComponent {
  @Input() links?: ProjectLink;
}
