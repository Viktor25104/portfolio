import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-shell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="close.emit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="close.emit()" aria-label="Close">×</button>
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
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
      will-change: transform;
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

      .close-btn {
        width: 50px;
        height: 50px;
        font-size: 1.6rem;
      }
    }

    @media (max-width: 480px) {
      .modal-content {
        padding: 1.5rem;
        padding-top: 2.5rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .modal-content,
      .close-btn {
        animation: none;
        transition-duration: 0.1s;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalShellComponent {
  @Output() close = new EventEmitter<void>();
}
