import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LangPipe } from '../../core/pipes/lang-pipe';
import { TranslationsService } from '../../core/services/translations.service';

interface ProjectLink {
  github?: string;
  demo?: string;
  additional?: Array<{url: string, label: string}>;
}

interface Project {
  id: string;
  title: any;
  category: string;
  thumbnail: string;
  description?: any;
  role?: any;
  duration?: string;
  images: string[];
  techStack?: {
    frontend?: string[];
    backend?: string[];
    other?: string[];
  };
  keyFeatures?: any[];
  achievements?: any[];
  links?: ProjectLink;
  hasFullPage?: boolean;
}

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [CommonModule, LangPipe],
  template: `
    <div class="modal-overlay" *ngIf="project" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <!-- Close Button -->
        <button class="close-btn" (click)="onClose()" aria-label="Close">×</button>

        <!-- Project Header -->
        <div class="project-header">
          <h2 class="project-title">{{ getProjectTitle() }}</h2>
          <div class="project-meta">
            <span class="project-category">{{ getCategoryTranslation() | lang }}</span>
            <span class="project-role" *ngIf="project.role">{{ getProjectRole() }}</span>
            <span class="project-duration" *ngIf="project.duration">{{ project.duration }}</span>
          </div>
          <p class="project-description" *ngIf="project.description">{{ getProjectDescription() }}</p>
        </div>

        <!-- Image Carousel -->
        <div class="image-carousel" *ngIf="project.images.length">
          <img
            [src]="project.images[currentImageIndex]"
            [alt]="getProjectTitle()"
            class="carousel-image">

          <div class="carousel-controls" *ngIf="project.images.length > 1">
            <button (click)="prevImage()" class="carousel-btn prev" [disabled]="project.images.length <= 1">‹</button>
            <div class="carousel-indicators">
      <span
        *ngFor="let image of project.images; let i = index"
        class="indicator"
        [class.active]="i === currentImageIndex"
        (click)="currentImageIndex = i">
      </span>
            </div>
            <button (click)="nextImage()" class="carousel-btn next" [disabled]="project.images.length <= 1">›</button>
          </div>
        </div>


        <!-- Content Grid -->
        <div class="content-grid">
          <!-- Technologies -->
          <div class="section" *ngIf="project.techStack">
            <h3>{{ 'TECHNOLOGIES_USED' | lang }}</h3>
            <div class="tech-categories">
              <div class="tech-category" *ngIf="project.techStack.frontend?.length">
                <h4>{{ 'FRONTEND' | lang }}</h4>
                <div class="tech-tags">
                  <span *ngFor="let tech of project.techStack.frontend" class="tech-tag frontend">{{ tech }}</span>
                </div>
              </div>
              <div class="tech-category" *ngIf="project.techStack.backend?.length">
                <h4>{{ 'BACKEND' | lang }}</h4>
                <div class="tech-tags">
                  <span *ngFor="let tech of project.techStack.backend" class="tech-tag backend">{{ tech }}</span>
                </div>
              </div>
              <div class="tech-category" *ngIf="project.techStack.other?.length">
                <h4>{{ 'OTHER_TOOLS' | lang }}</h4>
                <div class="tech-tags">
                  <span *ngFor="let tech of project.techStack.other" class="tech-tag other">{{ tech }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Key Features -->
          <div class="section" *ngIf="project.keyFeatures?.length">
            <h3>{{ 'KEY_FEATURES' | lang }}</h3>
            <ul class="features-list">
              <li *ngFor="let feature of project.keyFeatures">{{ getTranslatedText(feature) }}</li>
            </ul>
          </div>

          <!-- Achievements -->
          <div class="section" *ngIf="project.achievements?.length">
            <h3>{{ 'KEY_ACHIEVEMENTS' | lang }}</h3>
            <ul class="achievements-list">
              <li *ngFor="let achievement of project.achievements">{{ getTranslatedText(achievement) }}</li>
            </ul>
          </div>
        </div>

        <!-- Project Links -->
        <div class="project-links" *ngIf="project.links">
          <div class="links-container">
            <a *ngIf="project.links.github"
               [href]="project.links.github"
               target="_blank"
               rel="noopener noreferrer"
               class="link-btn github">
              <span class="link-icon">⚡</span>
              {{ 'VIEW_CODE' | lang }}
            </a>
            <a *ngIf="project.links.demo"
               [href]="project.links.demo"
               target="_blank"
               rel="noopener noreferrer"
               class="link-btn demo">
              <span class="link-icon">🚀</span>
              {{ 'LIVE_DEMO' | lang }}
            </a>
            <a *ngFor="let link of project.links.additional"
               [href]="link.url"
               target="_blank"
               rel="noopener noreferrer"
               class="link-btn additional">
              <span class="link-icon">🔗</span>
              {{ link.label }}
            </a>
          </div>
        </div>

        <!-- Full Details Button -->
        <div class="full-details-section" *ngIf="project.hasFullPage">
          <button class="full-details-btn" (click)="viewFullProject()">
            <span>{{ 'VIEW_FULL_PROJECT' | lang }}</span>
            <span class="arrow">→</span>
          </button>
        </div>
      </div>
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
    }/* Epic Project Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background:
        radial-gradient(circle at 25% 25%, rgba(76, 201, 240, 0.12) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(58, 12, 163, 0.12) 0%, transparent 50%),
        rgba(0, 0, 0, 0.88);
      backdrop-filter: blur(25px);
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
        backdrop-filter: blur(25px);
      }
    }

    .modal-content {
      background: linear-gradient(135deg, rgba(13, 27, 42, 0.98), rgba(20, 35, 55, 0.95));
      border: 2px solid var(--color-neon-blue);
      border-radius: 25px;
      padding: 3rem;
      max-width: 900px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      animation: modalSlideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow:
        0 30px 80px rgba(0, 0, 0, 0.6),
        0 0 50px rgba(76, 201, 240, 0.3),
        inset 0 1px 2px rgba(255, 255, 255, 0.1);
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

    /* Remove the glowing border animation */

    /* Remove content wrapper div styling */

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
      background: linear-gradient(45deg, var(--color-neon-blue), var(--color-purple));
      border-radius: 3px;
      border: 1px solid rgba(13, 27, 42, 0.5);
    }

    .modal-content::-webkit-scrollbar-thumb:hover {
      background: var(--color-neon-blue);
      box-shadow: 0 0 8px rgba(76, 201, 240, 0.5);
    }

    /* Enhanced Close Button */
    .close-btn {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      background: linear-gradient(135deg, rgba(13, 27, 42, 0.9), rgba(20, 35, 55, 0.8));
      border: 1px solid rgba(76, 201, 240, 0.4);
      color: rgba(255, 255, 255, 0.8);
      font-size: 1.8rem;
      cursor: pointer;
      width: 55px;
      height: 55px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 15px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 20;
      backdrop-filter: blur(15px);
      font-weight: 300;
    }

    .close-btn:hover {
      background: linear-gradient(135deg, var(--color-neon-blue), var(--color-purple));
      color: white;
      transform: rotate(90deg) scale(1.1);
      box-shadow: 0 0 30px rgba(76, 201, 240, 0.6);
      border-color: var(--color-neon-blue);
    }

    /* Epic Project Header */
    .project-header {
      margin-bottom: 3rem;
      padding-right: 4rem;
      position: relative;
      animation: slideInDown 0.6s ease-out 0.2s both;
    }


    /* Enhanced Project Title */
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

    /* Enhanced Project Meta */
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

    /* Epic Image Carousel */
    .image-carousel {
      position: relative;
      margin-bottom: 3rem;
      border-radius: 20px;
      overflow: hidden;
      box-shadow:
        0 20px 50px rgba(0, 0, 0, 0.4),
        0 0 30px rgba(76, 201, 240, 0.2);
      animation: slideInRight 0.8s ease-out 0.8s both;
      background: linear-gradient(45deg, rgba(76, 201, 240, 0.1), rgba(58, 12, 163, 0.1));
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .carousel-image {
      width: 100%;
      height: 400px;
      object-fit: cover;
      object-position: center;
      display: block;
      transition: all 0.5s ease;
      filter: brightness(0.9) contrast(1.1);
    }

    .image-carousel:hover .carousel-image {
      filter: brightness(1) contrast(1.2);
      transform: scale(1.02);
    }

    /* Enhanced Carousel Controls */
    .carousel-controls {
      position: absolute;
      bottom: 1.5rem;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1.5rem;
      background: linear-gradient(90deg, transparent, rgba(13, 27, 42, 0.8), transparent);
      padding: 1rem 2rem;
      backdrop-filter: blur(15px);
    }

    .carousel-btn {
      background: linear-gradient(135deg, rgba(13, 27, 42, 0.9), rgba(20, 35, 55, 0.8));
      border: 1px solid var(--color-neon-blue);
      color: white;
      width: 45px;
      height: 45px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      font-size: 1.4rem;
      font-weight: bold;
      backdrop-filter: blur(10px);
    }

    .carousel-btn:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--color-neon-blue), var(--color-purple));
      transform: scale(1.1);
      box-shadow: 0 0 20px rgba(76, 201, 240, 0.6);
    }

    .carousel-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
      transform: none;
    }

    /* Enhanced Carousel Indicators */
    .carousel-indicators {
      display: flex;
      gap: 0.8rem;
    }

    .indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border: 2px solid transparent;
    }

    .indicator:hover {
      background: rgba(255, 255, 255, 0.7);
      transform: scale(1.2);
    }

    .indicator.active {
      background: var(--color-neon-blue);
      box-shadow: 0 0 15px rgba(76, 201, 240, 0.8);
      border-color: rgba(255, 255, 255, 0.3);
      transform: scale(1.3);
    }

    /* Enhanced Content Grid */
    .content-grid {
      display: grid;
      gap: 3rem;
      margin-bottom: 3rem;
      animation: fadeInUp 1s ease-out 1s both;
      padding-right: 2px; /* Prevent content from touching scrollbar */
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .section {
      padding: 2.5rem;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(76, 201, 240, 0.03));
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
      height: 3px;
      background: linear-gradient(90deg, transparent, var(--color-neon-blue), var(--color-purple), transparent);
      transition: left 0.8s ease;
    }

    .section:hover::before {
      left: 100%;
    }

    .section:hover {
      transform: translateY(-8px);
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(76, 201, 240, 0.06));
      border-color: rgba(76, 201, 240, 0.3);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
    }

    .section h3 {
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

    .section h3::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 60px;
      height: 2px;
      background: linear-gradient(90deg, var(--color-neon-blue), var(--color-purple));
      box-shadow: 0 0 10px rgba(76, 201, 240, 0.6);
    }

    /* Enhanced Tech Categories */
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

    /* Enhanced Lists */
    .features-list, .achievements-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .features-list li, .achievements-list li {
      padding: 1rem 0;
      color: rgba(255, 255, 255, 0.9);
      border-left: 3px solid var(--color-neon-blue);
      padding-left: 1.5rem;
      margin-bottom: 1rem;
      font-size: 1rem;
      line-height: 1.6;
      position: relative;
      background: linear-gradient(90deg, rgba(76, 201, 240, 0.05), transparent);
      border-radius: 0 10px 10px 0;
      transition: all 0.3s ease;
    }

    .features-list li::before, .achievements-list li::before {
      content: '▶';
      position: absolute;
      left: -8px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-neon-blue);
      font-size: 0.8rem;
      background: rgba(13, 27, 42, 0.9);
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      border: 2px solid var(--color-neon-blue);
    }

    .features-list li:hover, .achievements-list li:hover {
      background: linear-gradient(90deg, rgba(76, 201, 240, 0.1), transparent);
      transform: translateX(10px);
      border-left-color: var(--color-purple);
    }

    /* Epic Project Links */
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

    /* Epic Full Details Button */
    .full-details-section {
      border-top: 2px solid rgba(255, 255, 255, 0.1);
      padding-top: 2rem;
      text-align: center;
      animation: fadeIn 1s ease-out 1.4s both;
    }

    .full-details-btn {
      background: linear-gradient(135deg, var(--color-purple), var(--color-neon-blue));
      border: none;
      color: white;
      padding: 1.2rem 3rem;
      border-radius: 30px;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      font-size: 1.1rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
      gap: 1rem;
      margin: 0 auto;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      position: relative;
      overflow: hidden;
    }

    .full-details-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.6s ease;
    }

    .full-details-btn:hover::before {
      left: 100%;
    }

    .full-details-btn:hover {
      background: linear-gradient(135deg, var(--color-neon-blue), var(--color-purple));
      transform: translateY(-5px) scale(1.05);
      box-shadow: 0 20px 50px rgba(76, 201, 240, 0.4);
    }

    .arrow {
      font-size: 1.3rem;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
    }

    .full-details-btn:hover .arrow {
      transform: translateX(8px) scale(1.2);
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .modal-overlay {
        padding: 1rem;
      }

      .modal-content {
        max-height: 95vh;
        border-radius: 20px;
        padding: 2rem;
        padding-top: 3rem;
      }

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

      .carousel-image {
        height: 250px;
      }

      .carousel-controls {
        padding: 0.8rem 1rem;
        gap: 1rem;
      }

      .carousel-btn {
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
      }

      .section {
        padding: 2rem;
      }

      .section h3 {
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

      .features-list li, .achievements-list li {
        padding: 0.8rem 0;
        padding-left: 1.2rem;
        font-size: 0.95rem;
      }

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

      .full-details-btn {
        padding: 1rem 2rem;
        font-size: 1rem;
      }

      .close-btn {
        width: 50px;
        height: 50px;
        font-size: 1.6rem;
      }

      .content-grid {
        padding-right: 4px; /* More space for mobile scrollbar */
      }
    }

    @media (max-width: 480px) {
      .modal-content {
        padding: 1.5rem;
        padding-top: 2.5rem;
      }

      .project-header {
        padding-right: 1.5rem;
      }

      .project-title {
        font-size: 2rem;
      }

      .carousel-image {
        height: 200px;
      }

      .section {
        padding: 1.5rem;
      }

      .tech-tags {
        gap: 0.5rem;
      }

      .tech-tag {
        padding: 0.4rem 0.8rem;
        font-size: 0.8rem;
      }

      .link-btn {
        padding: 0.8rem 1.5rem;
        font-size: 0.85rem;
        min-width: 180px;
      }

      .full-details-btn {
        padding: 0.9rem 1.8rem;
        font-size: 0.95rem;
      }

      .content-grid {
        padding-right: 6px; /* Even more space for small mobile scrollbar */
      }
    }

    /* Performance optimizations */
    .modal-content,
    .section,
    .tech-tag,
    .link-btn,
    .full-details-btn {
      will-change: transform;
    }

    .project-title,
    .carousel-image {
      will-change: filter, background-position;
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .modal-content,
      .project-title,
      .carousel-image,
      .section,
      .tech-tag,
      .link-btn {
        animation: none;
        transition-duration: 0.1s;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectModalComponent implements OnChanges {
  @Input() project: Project | null = null;
  @Output() close = new EventEmitter<void>();

  currentImageIndex = 0;

  constructor(
    private router: Router,
    private translations: TranslationsService
  ) {}

  ngOnChanges() {
    if (this.project) {
      this.currentImageIndex = 0;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  onClose() {
    document.body.style.overflow = 'auto';
    this.close.emit();
  }

  nextImage() {
    if (this.project?.images && this.project.images.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.project.images.length;
    }
  }

  prevImage() {
    if (this.project?.images && this.project.images.length > 1) {
      this.currentImageIndex = this.currentImageIndex === 0
        ? this.project.images.length - 1
        : this.currentImageIndex - 1;
    }
  }

  viewFullProject() {
    if (this.project) {
      this.onClose();
      this.router.navigate(['/project', this.project.id]);
    }
  }

  getProjectTitle(): string {
    const lang = this.translations.getCurrentLang();
    return this.project?.title?.[lang] || this.project?.title?.['en'] || this.project?.title || '';
  }

  getProjectDescription(): string {
    const lang = this.translations.getCurrentLang();
    return this.project?.description?.[lang] || this.project?.description?.['en'] || this.project?.description || '';
  }

  getProjectRole(): string {
    const lang = this.translations.getCurrentLang();
    return this.project?.role?.[lang] || this.project?.role?.['en'] || this.project?.role || '';
  }

  getCategoryTranslation(): string {
    const mapping: Record<string, string> = {
      'Web': 'WEB_DEVELOPMENT',
      'Mobile': 'MOBILE_APPS',
      'Games': 'GAMES',
      'Blockchain': 'BLOCKCHAIN',
      'Cybersecurity': 'CYBERSECURITY'
    };
    return mapping[this.project?.category || ''] || this.project?.category || '';
  }

  getTranslatedText(text: any): string {
    if (typeof text === 'string') return text;
    const lang = this.translations.getCurrentLang();
    return text?.[lang] || text?.['en'] || text || '';
  }
}
