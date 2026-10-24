import { useEffect, useRef } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  selector?: string;
  triggerOnce?: boolean;
}

/**
 * Custom hook to initialize an IntersectionObserver on elements matching a selector
 * within a container (or document).
 * Automatically marks intersecting elements with `.is-revealed` and unobserves them.
 * Respects `prefers-reduced-motion: reduce`.
 */
export function useScrollReveal(
  dependencies: any[] = [],
  options: UseScrollRevealOptions = {}
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    threshold = 0.08,
    rootMargin = '0px 0px -30px 0px',
    selector = '.reveal-on-scroll, .reveal-card, .reveal-image, .reveal-fade, [data-reveal]',
    triggerOnce = true,
  } = options;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !('IntersectionObserver' in window)) {
      // Reveal everything immediately
      const root = containerRef.current || document;
      const elements = root.querySelectorAll(selector);
      elements.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            entry.target.classList.remove('is-revealed');
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    const root = containerRef.current || document;
    const elements = root.querySelectorAll(selector);
    elements.forEach((el) => {
      // If already revealed and triggerOnce, skip
      if (triggerOnce && el.classList.contains('is-revealed')) {
        return;
      }
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, dependencies);

  return containerRef;
}
