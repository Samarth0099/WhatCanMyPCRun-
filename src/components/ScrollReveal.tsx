import React, { useEffect, useRef, useState } from 'react';

export type RevealVariant = 'slide-up' | 'fade' | 'card' | 'image' | 'scale';

interface ScrollRevealProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  variant?: RevealVariant;
  delayMs?: number;
  durationMs?: number;
  threshold?: number;
  rootMargin?: string;
  as?: React.ElementType;
  style?: React.CSSProperties;
  triggerOnce?: boolean;
}

/**
 * High-performance IntersectionObserver-based reveal component
 * - Applies smooth GPU-accelerated fade-in and slide-up transitions
 * - Automatically respects prefers-reduced-motion: reduce
 * - Graceful fallback: instantly visible if IntersectionObserver is unavailable
 * - Unobserves element once revealed to eliminate scroll overhead
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  variant = 'slide-up',
  delayMs = 0,
  durationMs,
  threshold = 0.08,
  rootMargin = '0px 0px -40px 0px',
  as: Component = 'div',
  style = {},
  triggerOnce = true,
  ...rest
}) => {
  const elementRef = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(() => {
    // If SSR or reduced-motion is preferred, default to revealed immediately
    if (typeof window !== 'undefined') {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced || !('IntersectionObserver' in window)) {
        return true;
      }
    }
    return false;
  });

  useEffect(() => {
    // 1. Accessibility check: if reduced motion is preferred, reveal immediately without animation
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !('IntersectionObserver' in window)) {
      setIsRevealed(true);
      return;
    }

    const node = elementRef.current;
    if (!node) return;

    // If already revealed and triggerOnce is true, no need to observe
    if (isRevealed && triggerOnce) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            setIsRevealed(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, isRevealed]);

  // Compute inline styles for delay & duration if specified
  const inlineStyles: React.CSSProperties = {
    ...style,
    ...(delayMs > 0 ? { transitionDelay: `${delayMs}ms` } : {}),
    ...(durationMs ? { transitionDuration: `${durationMs}ms` } : {}),
  };

  const variantClassMap: Record<RevealVariant, string> = {
    'slide-up': 'reveal-on-scroll',
    'fade': 'reveal-fade',
    'card': 'reveal-card',
    'image': 'reveal-image',
    'scale': 'reveal-scale',
  };

  const revealClass = `${variantClassMap[variant]} ${isRevealed ? 'is-revealed' : ''} ${className}`.trim();

  return (
    <Component
      ref={elementRef as any}
      className={revealClass}
      style={inlineStyles}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default ScrollReveal;
