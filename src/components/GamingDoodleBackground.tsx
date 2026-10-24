import React from 'react';
import { ThemeConfig } from '../types/theme';

interface GamingDoodleBackgroundProps {
  activeTheme: ThemeConfig;
}

/**
 * AAA Gaming Doodle Art Background
 * - High-detail, hand-drawn vector sketch art covering all major gaming genres:
 *   Action/RPG, Sci-Fi/Space, Open-World, Shooters, Racing, Survival, and Gaming Tech.
 * - 3 subtle layers of visual depth (faint background, rich midground, theme-accented details).
 * - Central vignette gradient preserving 100% text readability for heading & description.
 */
export const GamingDoodleBackground: React.FC<GamingDoodleBackgroundProps> = ({ activeTheme }) => {
  const accent1 = activeTheme.primaryHex || '#00F5FF';
  const accent2 = activeTheme.secondaryHex || '#8B5CF6';

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl select-none" aria-hidden="true">
      {/* 1. Base Charcoal / Deep Graphite Slate */}
      <div className="absolute inset-0 bg-[#090C12]" />

      {/* 2. Intricate AAA Gaming Doodle Vector Canvas */}
      <svg
        className="absolute inset-0 w-full h-full object-cover"
        viewBox="0 0 1200 320"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle accent gradients */}
          <linearGradient id="doodle-cyan-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={accent1} stopOpacity="0.8" />
            <stop offset="100%" stopColor={accent2} stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="doodle-violet-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={accent2} stopOpacity="0.75" />
            <stop offset="100%" stopColor={accent1} stopOpacity="0.35" />
          </linearGradient>

          {/* Sketchy line style filters */}
          <linearGradient id="glow-line" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent1} stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* ==============================================================
            LAYER 1: BACKGROUND FAINT SKETCHES (Depth Layer: opacity 0.08 - 0.14)
            Geometric grids, distant constellations, hex matrices, faint runes
            ============================================================== */}
        <g stroke="#ffffff" strokeOpacity="0.09" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          {/* Hexagonal energy grid fragments */}
          <path d="M 60 40 L 75 31 L 90 40 L 90 58 L 75 67 L 60 58 Z" />
          <path d="M 90 40 L 105 31 L 120 40 L 120 58 L 105 67 L 90 58 Z" />
          <path d="M 75 67 L 90 58 L 105 67 L 105 85 L 90 94 L 75 85 Z" />
          <path d="M 1080 30 L 1095 21 L 1110 30 L 1110 48 L 1095 57 L 1080 48 Z" />
          <path d="M 1110 30 L 1125 21 L 1140 30 L 1140 48 L 1125 57 L 1110 48 Z" />
          <path d="M 1095 57 L 1110 48 L 1125 57 L 1125 75 L 1110 84 L 1095 75 Z" />

          {/* Distant starry constellations & targeting coordinate crossmarks */}
          <path d="M 220 25 L 220 35 M 215 30 L 225 30" strokeOpacity="0.15" />
          <path d="M 450 35 L 450 45 M 445 40 L 455 40" strokeOpacity="0.12" />
          <path d="M 780 20 L 780 30 M 775 25 L 785 25" strokeOpacity="0.12" />
          <path d="M 980 45 L 980 55 M 975 50 L 985 50" strokeOpacity="0.15" />

          {/* Subtle topographic contour lines (Open-World theme) */}
          <path d="M 480 290 Q 550 270 630 285 T 760 275 T 880 295" strokeOpacity="0.08" />
          <path d="M 460 305 Q 560 280 640 298 T 790 288 T 910 310" strokeOpacity="0.06" />

          {/* Faint inventory equipment slot boxes */}
          <rect x="520" y="24" width="18" height="18" rx="3" strokeOpacity="0.09" />
          <rect x="544" y="24" width="18" height="18" rx="3" strokeOpacity="0.09" />
          <rect x="568" y="24" width="18" height="18" rx="3" strokeOpacity="0.09" />
          <rect x="592" y="24" width="18" height="18" rx="3" strokeOpacity="0.09" />
          <rect x="616" y="24" width="18" height="18" rx="3" strokeOpacity="0.09" />
          <rect x="640" y="24" width="18" height="18" rx="3" strokeOpacity="0.09" />
        </g>

        {/* ==============================================================
            LAYER 2: MIDDLEGROUND DOODLES (Silver / Muted Grey / Off-White, opacity 0.22 - 0.35)
            ============================================================== */}
        <g stroke="#CBD5E1" strokeOpacity="0.26" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
          
          {/* --- [ZONE 1: TOP-LEFT & LEFT WING - ACTION, ADVENTURE & RPG] --- */}

          {/* 1. Medieval Knight Crusader Helmet with Visor Slits */}
          <g transform="translate(30, 20) rotate(-6)">
            <path d="M 30 15 C 30 5, 55 5, 55 15 L 58 45 C 58 60, 28 60, 28 45 Z" />
            <path d="M 28 32 L 58 32" strokeWidth="1.5" />
            {/* Cross visor slits */}
            <line x1="34" y1="26" x2="52" y2="26" />
            <line x1="34" y1="38" x2="52" y2="38" />
            <line x1="43" y1="20" x2="43" y2="44" strokeWidth="1.5" />
            {/* Ventilation pinholes */}
            <circle cx="36" cy="48" r="1" fill="#CBD5E1" fillOpacity="0.26" />
            <circle cx="43" cy="48" r="1" fill="#CBD5E1" fillOpacity="0.26" />
            <circle cx="50" cy="48" r="1" fill="#CBD5E1" fillOpacity="0.26" />
            <circle cx="40" cy="53" r="1" fill="#CBD5E1" fillOpacity="0.26" />
            <circle cx="46" cy="53" r="1" fill="#CBD5E1" fillOpacity="0.26" />
          </g>

          {/* 2. Medieval Broadsword / Longsword */}
          <g transform="translate(100, 15) rotate(24)">
            {/* Blade */}
            <path d="M 40 10 L 44 80 L 40 92 L 36 80 Z" />
            {/* Fuller groove */}
            <line x1="40" y1="18" x2="40" y2="76" strokeWidth="1" strokeOpacity="0.3" />
            {/* Crossguard */}
            <path d="M 24 80 Q 40 82 56 80 L 57 85 Q 40 86 23 85 Z" />
            {/* Hilt & Pommel */}
            <line x1="40" y1="85" x2="40" y2="104" strokeWidth="2" />
            <circle cx="40" cy="107" r="4" />
          </g>

          {/* 3. Heraldic Shield with Crest */}
          <g transform="translate(15, 110) rotate(8)">
            <path d="M 20 20 L 55 20 C 55 45, 50 65, 37.5 75 C 25 65, 20 45, 20 20 Z" strokeWidth="1.5" />
            <path d="M 26 26 L 49 26 C 49 44, 45 58, 37.5 66 C 30 58, 26 44, 26 26 Z" strokeOpacity="0.18" />
            {/* Crest diagonal stripe */}
            <line x1="24" y1="28" x2="48" y2="60" strokeWidth="1.5" />
            <circle cx="37.5" cy="42" r="3.5" />
          </g>

          {/* 4. Alchemical Potion Flask (Mana / Health) */}
          <g transform="translate(75, 125) rotate(-10)">
            {/* Cork */}
            <rect x="26" y="10" width="12" height="7" rx="1.5" />
            {/* Neck */}
            <path d="M 28 17 L 28 26 L 16 48 C 12 55, 18 64, 32 64 C 46 64, 52 55, 48 48 L 36 26 L 36 17 Z" />
            {/* Bubbling liquid line */}
            <path d="M 19 46 Q 32 50 45 46" strokeOpacity="0.4" />
            <circle cx="27" cy="54" r="2" strokeOpacity="0.35" />
            <circle cx="37" cy="52" r="1.5" strokeOpacity="0.35" />
            <circle cx="32" cy="57" r="1" strokeOpacity="0.35" />
          </g>

          {/* 5. Ancient Treasure Chest */}
          <g transform="translate(125, 185) rotate(-4)">
            {/* Arched lid */}
            <path d="M 20 30 Q 42 16 64 30 L 64 38 L 20 38 Z" />
            {/* Box base */}
            <rect x="20" y="38" width="44" height="26" rx="2" />
            {/* Metal bands */}
            <line x1="28" y1="21" x2="28" y2="64" />
            <line x1="56" y1="21" x2="56" y2="64" />
            {/* Keyhole clasp */}
            <rect x="38" y="34" width="8" height="10" rx="1.5" fill="#090C12" />
            <circle cx="42" cy="38" r="1.5" fill="#CBD5E1" />
            <line x1="42" y1="39.5" x2="42" y2="42" />
          </g>

          {/* 6. Arcane Magic Runes & Celestial Star */}
          <g transform="translate(40, 215) rotate(14)">
            <circle cx="40" cy="40" r="28" strokeDasharray="3 3" strokeOpacity="0.25" />
            <polygon points="40,16 48,34 64,40 48,46 40,64 32,46 16,40 32,34" strokeWidth="1" />
            <circle cx="40" cy="40" r="5" />
          </g>

          {/* 7. Dual Curved Daggers */}
          <g transform="translate(145, 95) rotate(-35)">
            <path d="M 20 10 Q 32 30 25 55 L 22 55 Q 26 32 17 12 Z" />
            <line x1="16" y1="55" x2="31" y2="55" strokeWidth="2" />
            <line x1="23.5" y1="56" x2="23.5" y2="68" strokeWidth="1.5" />
            <circle cx="23.5" cy="70" r="2" />
          </g>

          {/* --- [ZONE 2: TOP-RIGHT & RIGHT WING - SCI-FI, SPACE & TACTICAL SHOOTER] --- */}

          {/* 8. Stealth Fighter / Space Interceptor */}
          <g transform="translate(1050, 25) rotate(-18)">
            {/* Cockpit fuselage */}
            <path d="M 50 10 L 60 55 L 68 85 L 50 80 L 32 85 L 40 55 Z" strokeWidth="1.5" />
            {/* Swept delta wings */}
            <path d="M 40 55 L 10 75 L 22 82 L 34 78" />
            <path d="M 60 55 L 90 75 L 78 82 L 66 78" />
            {/* Cockpit window */}
            <polygon points="50,22 55,42 50,48 45,42" strokeOpacity="0.4" />
            {/* Thruster exhaust vents */}
            <line x1="44" y1="82" x2="44" y2="90" strokeWidth="1.5" />
            <line x1="56" y1="82" x2="56" y2="90" strokeWidth="1.5" />
          </g>

          {/* 9. Ringed Exoplanet & Orbital Moons */}
          <g transform="translate(1110, 110) rotate(-15)">
            <circle cx="40" cy="40" r="20" strokeWidth="1.5" />
            {/* Ring ellipse passing in front & behind */}
            <path d="M 10 48 Q 40 68 70 48" strokeWidth="1.5" />
            <path d="M 70 48 Q 78 42 70 36 Q 40 18 10 36 Q 2 42 10 48" strokeDasharray="2 2" strokeOpacity="0.3" />
            {/* Planet surface craters */}
            <circle cx="34" cy="34" r="3.5" strokeOpacity="0.25" />
            <circle cx="46" cy="45" r="2" strokeOpacity="0.25" />
            <circle cx="48" cy="28" r="1.5" strokeOpacity="0.2" />
            {/* Small satellite moon */}
            <circle cx="82" cy="22" r="3" />
          </g>

          {/* 10. Sci-Fi Plasma / Energy Weapon */}
          <g transform="translate(980, 75) rotate(-6)">
            {/* Barrel & receiver */}
            <path d="M 15 32 L 65 32 L 68 28 L 88 28 L 88 36 L 68 36 L 65 42 L 40 42 L 35 52 L 28 50 L 32 42 L 15 42 Z" strokeWidth="1.5" />
            {/* Holographic scope */}
            <rect x="42" y="22" width="22" height="6" rx="1" />
            <line x1="46" y1="28" x2="46" y2="32" />
            <line x1="60" y1="28" x2="60" y2="32" />
            {/* Energy heat sink vents */}
            <line x1="72" y1="30" x2="72" y2="34" strokeWidth="1" />
            <line x1="76" y1="30" x2="76" y2="34" strokeWidth="1" />
            <line x1="80" y1="30" x2="80" y2="34" strokeWidth="1" />
            <line x1="84" y1="30" x2="84" y2="34" strokeWidth="1" />
            {/* Battery pack / magazine */}
            <rect x="44" y="42" width="10" height="14" rx="1" />
          </g>

          {/* 11. Tactical Helmet with NVG Shroud */}
          <g transform="translate(1030, 160) rotate(6)">
            {/* Outer dome */}
            <path d="M 25 35 C 25 15, 65 15, 65 35 L 68 45 C 68 52, 60 55, 55 52 L 55 48 L 35 48 L 35 52 C 30 55, 22 52, 22 45 Z" strokeWidth="1.5" />
            {/* NVG forehead mount */}
            <rect x="40" y="24" width="10" height="9" rx="1.5" strokeOpacity="0.4" />
            {/* Ear protection / comms rail */}
            <path d="M 23 38 Q 28 42 28 48" />
            <path d="M 67 38 Q 62 42 62 48" />
            {/* Velcro tactical patch area */}
            <line x1="38" y1="18" x2="52" y2="18" strokeDasharray="2 2" strokeOpacity="0.3" />
          </g>

          {/* 12. Military Dog Tags on Chain */}
          <g transform="translate(950, 155) rotate(-22)">
            {/* Chain loop */}
            <path d="M 20 15 Q 35 5 45 20 Q 52 35 40 45" strokeDasharray="2 2" strokeOpacity="0.3" />
            {/* Tag 1 */}
            <rect x="30" y="32" width="18" height="28" rx="5" strokeWidth="1.2" transform="rotate(12 30 32)" />
            {/* Tag 2 */}
            <rect x="36" y="36" width="18" height="28" rx="5" strokeWidth="1.2" transform="rotate(-6 36 36)" strokeOpacity="0.2" />
            {/* Tag notch & line impressions */}
            <line x1="41" y1="44" x2="50" y2="44" strokeOpacity="0.3" />
            <line x1="41" y1="48" x2="50" y2="48" strokeOpacity="0.3" />
            <line x1="41" y1="52" x2="47" y2="52" strokeOpacity="0.3" />
          </g>

          {/* 13. Smoke Grenade Canister */}
          <g transform="translate(1120, 205) rotate(15)">
            <rect x="25" y="22" width="22" height="36" rx="3" strokeWidth="1.5" />
            {/* Top fuse head & pull-ring */}
            <rect x="30" y="14" width="12" height="8" rx="1" />
            <path d="M 42 16 Q 48 16 48 24 L 46 32" strokeWidth="1.2" />
            <circle cx="26" cy="18" r="4" strokeWidth="1.2" />
            {/* Warning stripes */}
            <line x1="25" y1="30" x2="47" y2="30" strokeOpacity="0.3" />
            <line x1="25" y1="34" x2="47" y2="34" strokeOpacity="0.3" />
          </g>

          {/* --- [ZONE 3: BOTTOM CORNERS & SIDES - RACING, OPEN WORLD & GAMING CULTURE] --- */}

          {/* 14. Supercar Silhouette (Racing & Open-World) */}
          <g transform="translate(210, 240) rotate(-2)">
            {/* Body roofline & aerodynamics */}
            <path d="M 10 38 Q 25 38 35 32 L 55 22 Q 75 16 95 24 L 115 32 Q 130 34 140 38 L 138 45 L 12 45 Z" strokeWidth="1.5" />
            {/* Cockpit canopy */}
            <path d="M 52 24 L 62 18 Q 80 16 92 24 Z" strokeOpacity="0.35" />
            {/* Front & rear wheel arches with detailed alloy wheels */}
            <circle cx="36" cy="45" r="9" />
            <circle cx="36" cy="45" r="5" strokeOpacity="0.3" />
            <circle cx="114" cy="45" r="9" />
            <circle cx="114" cy="45" r="5" strokeOpacity="0.3" />
            {/* Rear GT wing spoiler */}
            <path d="M 124 24 L 138 24 L 136 30" strokeWidth="1.5" />
            <line x1="128" y1="24" x2="128" y2="34" strokeWidth="1.2" />
            <line x1="135" y1="24" x2="135" y2="34" strokeWidth="1.2" />
          </g>

          {/* 15. Tachometer / Speedometer Gauge */}
          <g transform="translate(370, 245)">
            <path d="M 15 45 A 25 25 0 1 1 55 45" strokeWidth="1.5" />
            {/* RPM tick marks */}
            <line x1="18" y1="36" x2="22" y2="38" />
            <line x1="23" y1="26" x2="27" y2="29" />
            <line x1="35" y1="20" x2="35" y2="25" />
            <line x1="47" y1="26" x2="43" y2="29" />
            <line x1="52" y1="36" x2="48" y2="38" />
            {/* Indicator Needle */}
            <line x1="35" y1="40" x2="48" y2="24" strokeWidth="1.5" />
            <circle cx="35" cy="40" r="3" fill="#CBD5E1" />
          </g>

          {/* 16. Crossed Racing Checkered Flags */}
          <g transform="translate(130, 235)">
            <line x1="20" y1="55" x2="50" y2="15" strokeWidth="1.5" />
            <line x1="50" y1="55" x2="20" y2="15" strokeWidth="1.5" />
            {/* Left waving flag */}
            <path d="M 20 15 Q 28 12 34 18 Q 40 24 48 20 L 44 38 Q 36 42 30 36 Q 24 30 16 33 Z" />
            {/* Checkered pattern lines */}
            <line x1="26" y1="16" x2="22" y2="34" strokeOpacity="0.3" />
            <line x1="36" y1="19" x2="32" y2="38" strokeOpacity="0.3" />
          </g>

          {/* 17. Ergonomic Console Controller */}
          <g transform="translate(730, 240) rotate(5)">
            {/* Controller outer shell */}
            <path d="M 22 28 Q 45 22 68 28 Q 78 35 74 58 Q 70 70 58 64 L 54 52 Q 45 54 36 52 L 32 64 Q 20 70 16 58 Q 12 35 22 28 Z" strokeWidth="1.5" />
            {/* D-Pad on left */}
            <path d="M 28 36 H 32 V 32 H 36 V 36 H 40 V 40 H 36 V 44 H 32 V 40 H 28 Z" strokeWidth="1" />
            {/* Action buttons diamond on right */}
            <circle cx="58" cy="34" r="1.5" />
            <circle cx="64" cy="38" r="1.5" />
            <circle cx="58" cy="42" r="1.5" />
            <circle cx="52" cy="38" r="1.5" />
            {/* Twin thumbsticks */}
            <circle cx="36" cy="48" r="4.5" />
            <circle cx="54" cy="48" r="4.5" />
          </g>

          {/* 18. Professional Gaming Headset with Boom Mic */}
          <g transform="translate(835, 235) rotate(-6)">
            {/* Padded headband arc */}
            <path d="M 20 40 C 20 18, 55 18, 55 40" strokeWidth="2" />
            {/* Left and right earcups */}
            <rect x="14" y="36" width="10" height="18" rx="4" strokeWidth="1.5" />
            <rect x="51" y="36" width="10" height="18" rx="4" strokeWidth="1.5" />
            {/* Microphone boom arm */}
            <path d="M 22 50 Q 28 64 42 62" strokeWidth="1.2" />
            <rect x="42" y="60" width="6" height="4" rx="1.5" strokeWidth="1" />
          </g>

          {/* 19. Mechanical Keyboard WASD Cluster */}
          <g transform="translate(930, 245)">
            {/* Key W */}
            <rect x="34" y="12" width="16" height="14" rx="2" strokeWidth="1.2" />
            <path d="M 38 18 L 40 23 L 42 19 L 44 23 L 46 18" strokeWidth="1" strokeOpacity="0.4" />
            {/* Key A */}
            <rect x="16" y="28" width="16" height="14" rx="2" strokeWidth="1.2" />
            <path d="M 20 38 L 24 31 L 28 38 M 21 36 L 27 36" strokeWidth="1" strokeOpacity="0.4" />
            {/* Key S */}
            <rect x="34" y="28" width="16" height="14" rx="2" strokeWidth="1.2" />
            <path d="M 44 32 Q 40 30 40 33 Q 40 36 44 37 Q 44 40 40 40" strokeWidth="1" strokeOpacity="0.4" />
            {/* Key D */}
            <rect x="52" y="28" width="16" height="14" rx="2" strokeWidth="1.2" />
            <path d="M 56 31 L 56 39 M 56 31 Q 64 35 56 39" strokeWidth="1" strokeOpacity="0.4" />
          </g>

          {/* 20. 8-Bit Retro Pixel Hearts */}
          <g transform="translate(670, 25) rotate(-8)">
            <path d="M 14 14 H 18 V 10 H 26 V 14 H 30 V 10 H 38 V 14 H 42 V 22 H 38 V 26 H 34 V 30 H 30 V 34 H 26 V 38 H 22 V 34 H 18 V 30 H 14 V 26 H 10 V 14 H 14 Z" strokeWidth="1.2" strokeOpacity="0.3" />
          </g>

          {/* 21. High-Precision Tactical Crosshair Reticle */}
          <g transform="translate(885, 20)">
            <circle cx="35" cy="35" r="24" strokeWidth="1.5" />
            <circle cx="35" cy="35" r="14" strokeDasharray="3 3" strokeOpacity="0.3" />
            <line x1="35" y1="5" x2="35" y2="25" strokeWidth="1.5" />
            <line x1="35" y1="45" x2="35" y2="65" strokeWidth="1.5" />
            <line x1="5" y1="35" x2="25" y2="35" strokeWidth="1.5" />
            <line x1="45" y1="35" x2="65" y2="35" strokeWidth="1.5" />
            {/* Mil-dot stadia marks */}
            <circle cx="35" cy="20" r="1" fill="#CBD5E1" />
            <circle cx="35" cy="50" r="1" fill="#CBD5E1" />
            <circle cx="20" cy="35" r="1" fill="#CBD5E1" />
            <circle cx="50" cy="35" r="1" fill="#CBD5E1" />
          </g>

          {/* 22. 16-Point Navigation Compass Rose (Open-World) */}
          <g transform="translate(300, 20) rotate(12)">
            <circle cx="35" cy="35" r="22" strokeWidth="1" strokeOpacity="0.25" />
            {/* Compass 4-point primary diamond */}
            <polygon points="35,14 38,32 56,35 38,38 35,56 32,38 14,35 32,32" strokeWidth="1.2" />
            <polygon points="35,14 35,35 38,32" fill="#CBD5E1" fillOpacity="0.25" />
            <polygon points="56,35 35,35 38,38" fill="#CBD5E1" fillOpacity="0.25" />
            <polygon points="35,56 35,35 32,38" fill="#CBD5E1" fillOpacity="0.25" />
            <polygon points="14,35 35,35 32,32" fill="#CBD5E1" fillOpacity="0.25" />
            <circle cx="35" cy="35" r="2" fill="#CBD5E1" />
          </g>

          {/* 23. Achievement Hexagonal Badge with Star */}
          <g transform="translate(490, 235) rotate(-4)">
            <polygon points="30,12 48,22 48,44 30,54 12,44 12,22" strokeWidth="1.2" />
            <polygon points="30,22 33,29 41,30 35,35 37,42 30,38 23,42 25,35 19,30 27,29" strokeWidth="1" strokeOpacity="0.4" />
          </g>
        </g>

        {/* ==============================================================
            LAYER 3: ACCENT LAYER (Restrained Theme/Cyan/Electric Blue/Violet Accents)
            Selected highlights on key gaming icons near outer margins
            ============================================================== */}
        <g strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          
          {/* Cyan / Theme Accent on Longsword fuller & blade tip */}
          <g transform="translate(100, 15) rotate(24)">
            <line x1="40" y1="12" x2="40" y2="52" stroke={accent1} strokeOpacity="0.65" strokeWidth="1.5" />
            <circle cx="40" cy="10" r="1.5" fill={accent1} fillOpacity="0.8" />
          </g>

          {/* Electric Blue / Theme Accent on Shield Crest */}
          <g transform="translate(15, 110) rotate(8)">
            <circle cx="37.5" cy="42" r="3" stroke={accent2} strokeOpacity="0.7" fill={accent2} fillOpacity="0.2" />
            <line x1="28" y1="32" x2="47" y2="56" stroke={accent1} strokeOpacity="0.55" />
          </g>

          {/* Vibrant Glow on Potion Liquid */}
          <g transform="translate(75, 125) rotate(-10)">
            <path d="M 20 50 Q 32 54 44 50" stroke={accent1} strokeOpacity="0.75" />
            <circle cx="32" cy="56" r="2" fill={accent1} fillOpacity="0.6" stroke={accent1} />
          </g>

          {/* Futuristic Fighter Engine Afterburner & Wingtip Beacons */}
          <g transform="translate(1050, 25) rotate(-18)">
            <line x1="44" y1="84" x2="44" y2="96" stroke={accent1} strokeWidth="2" strokeOpacity="0.8" />
            <line x1="56" y1="84" x2="56" y2="96" stroke={accent1} strokeWidth="2" strokeOpacity="0.8" />
            <circle cx="10" cy="75" r="1.5" fill={accent2} fillOpacity="0.9" />
            <circle cx="90" cy="75" r="1.5" fill={accent1} fillOpacity="0.9" />
          </g>

          {/* Sci-Fi Plasma Weapon Hologram Sight & Energy Chamber */}
          <g transform="translate(980, 75) rotate(-6)">
            <circle cx="53" cy="25" r="2" fill={accent1} fillOpacity="0.8" stroke={accent1} />
            <line x1="68" y1="34" x2="86" y2="34" stroke={accent2} strokeOpacity="0.8" strokeWidth="2" />
          </g>

          {/* Tactical Crosshair Center Point & Redline Indicator */}
          <g transform="translate(885, 20)">
            <circle cx="35" cy="35" r="2" fill={accent1} fillOpacity="0.9" stroke={accent1} />
            <circle cx="35" cy="35" r="6" stroke={accent2} strokeOpacity="0.5" strokeDasharray="2 2" />
          </g>

          {/* Supercar Headlight Beam & Tachometer Redline Arc */}
          <g transform="translate(210, 240) rotate(-2)">
            <line x1="12" y1="41" x2="2" y2="44" stroke={accent1} strokeOpacity="0.75" strokeWidth="1.5" />
          </g>

          <g transform="translate(370, 245)">
            {/* High RPM Redline zone */}
            <path d="M 43 23 A 25 25 0 0 1 55 45" stroke="#F43F5E" strokeWidth="2" strokeOpacity="0.65" />
            <line x1="35" y1="40" x2="48" y2="24" stroke={accent1} strokeWidth="1.8" strokeOpacity="0.8" />
          </g>

          {/* Game Controller LED Lightbar */}
          <g transform="translate(730, 240) rotate(5)">
            <path d="M 38 24 Q 45 23 52 24" stroke={accent2} strokeWidth="2" strokeOpacity="0.85" />
          </g>

          {/* Headset Mic Mute Indicator & Trophy Star */}
          <g transform="translate(835, 235) rotate(-6)">
            <circle cx="48" cy="62" r="1.5" fill={accent1} fillOpacity="0.9" />
          </g>

          <g transform="translate(490, 235) rotate(-4)">
            <circle cx="30" cy="33" r="2" fill={accent1} fillOpacity="0.8" />
          </g>
        </g>
      </svg>

      {/* 3. Text Readability Shield (80-90% Neutral/Dark Vignette)
          - Keeps the central heading "GAMES LIBRARY" & description pristine, sharp, and high-contrast
          - Seamlessly blends into doodle-covered perimeters and edges */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 65% 85% at 42% 48%, rgba(8, 11, 16, 0.95) 0%, rgba(9, 12, 18, 0.85) 55%, rgba(9, 12, 18, 0.42) 100%)`,
        }}
      />

      {/* 4. Fine-grain subtle edge sheen */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#090C12]/90 via-transparent to-[#090C12]/40" />

      {/* 5. Delicate Theme Tint along top edge matching active palette */}
      <div 
        className="absolute top-0 left-0 right-0 h-[1px] opacity-40"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${accent1} 30%, ${accent2} 70%, transparent 100%)`,
        }}
      />
    </div>
  );
};
