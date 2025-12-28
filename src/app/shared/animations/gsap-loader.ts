import type { gsap as gsapType } from 'gsap';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';

let cached: Promise<{ gsap: typeof gsapType; ScrollTrigger: typeof ScrollTriggerType }> | null = null;

export const loadGsap = (): Promise<{ gsap: typeof gsapType; ScrollTrigger: typeof ScrollTriggerType }> => {
  if (!cached) {
    cached = Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([gsapModule, scrollTriggerModule]) => ({
        gsap: gsapModule.gsap,
        ScrollTrigger: scrollTriggerModule.ScrollTrigger
      })
    );
  }

  return cached;
};
