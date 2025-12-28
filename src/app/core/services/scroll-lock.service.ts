import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ScrollLockService {
  private lockCount = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  lock(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.lockCount += 1;
    if (this.lockCount === 1) {
      document.body.style.overflow = 'hidden';
    }
  }

  unlock(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.lockCount = Math.max(0, this.lockCount - 1);
    if (this.lockCount === 0) {
      document.body.style.overflow = 'auto';
    }
  }
}
