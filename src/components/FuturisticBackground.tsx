import React, { useEffect, useRef } from 'react';
import { ThemeId, THEMES } from '../types/theme';

interface FuturisticBackgroundProps {
  currentTheme: ThemeId;
}

export const FuturisticBackground: React.FC<FuturisticBackgroundProps> = ({ currentTheme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeTheme = THEMES[currentTheme] || THEMES.mocha_mousse;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shouldReduceMotion = mediaQuery.matches;

    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool (approx 36 particles - very lightweight, GPU-friendly)
    const particleCount = width < 768 ? 20 : 36;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.35 + 0.15), // Gentle upward drift
      alpha: Math.random() * 0.4 + 0.15,
      isPrimary: Math.random() > 0.4,
    }));

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Render floating particles
      particles.forEach((p) => {
        if (!shouldReduceMotion) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.isPrimary
          ? `${activeTheme.primaryHex}${Math.round(p.alpha * 255).toString(16).padStart(2, '0')}`
          : `${activeTheme.secondaryHex}${Math.round((p.alpha * 0.7) * 255).toString(16).padStart(2, '0')}`;
        ctx.shadowBlur = p.size * 3;
        ctx.shadowColor = p.isPrimary ? activeTheme.primaryHex : activeTheme.secondaryHex;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      if (!shouldReduceMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    if (!shouldReduceMotion) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      render(0);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeTheme.primaryHex, activeTheme.secondaryHex]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Deep Black / Titanium Base with Dark Navy Gradients */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 100% 70% at 50% -15%, ${activeTheme.primaryHex}15 0%, transparent 60%),
                       radial-gradient(ellipse 80% 60% at 100% 40%, ${activeTheme.secondaryHex}12 0%, transparent 60%),
                       radial-gradient(ellipse 80% 60% at 0% 75%, ${activeTheme.primaryHex}09 0%, transparent 60%),
                       linear-gradient(180deg, ${activeTheme.bgHex} 0%, ${activeTheme.cardBgHex} 50%, ${activeTheme.bgHex} 100%)`,
        }}
      />

      {/* 2. Soft Light Cone / Volumetric Hardware Chamber Rays */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] opacity-25 blur-[120px] rounded-full"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${activeTheme.primaryHex} 0%, ${activeTheme.secondaryHex} 40%, transparent 70%)`,
        }}
      />

      {/* 3. Subtle Technical Grid with HUD Coordinates */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* 4. Subtle Circuit Board Traces & Geometric Hardware Accents */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="circuit-pattern" width="160" height="160" patternUnits="userSpaceOnUse">
            {/* Horizontal bus line */}
            <path d="M 0 40 L 60 40 L 80 60 L 160 60" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="60" cy="40" r="2.5" fill="currentColor" />
            <circle cx="160" cy="60" r="2.5" fill="currentColor" />
            
            {/* Vertical bus line */}
            <path d="M 120 0 L 120 70 L 140 90 L 140 160" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="120" cy="70" r="2.5" fill="currentColor" />
            <circle cx="140" cy="90" r="2.5" fill="currentColor" />

            {/* Corner chip socket marker */}
            <rect x="25" y="95" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="36" cy="106" r="1.5" fill="currentColor" />
            <path d="M 47 106 L 90 106 L 105 121 L 105 160" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit-pattern)" style={{ color: activeTheme.primaryHex }} />
      </svg>

      {/* 5. Particle Canvas Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 6. Subtle Vignette Edge for Deep 3D Immersion */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 140px rgba(0, 0, 0, 0.75)',
        }}
      />
    </div>
  );
};
