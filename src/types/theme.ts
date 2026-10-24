export type ThemeId =
  | 'mocha_mousse'
  | 'teal_cream'
  | 'deep_purple_orange'
  | 'cyberpunk'
  | 'matrix'
  | 'synthwave'
  | 'deep_space'
  | 'forest_calm';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  colorsDescription: string;
  vibe: string;
  bestFor: string;
  primaryHex: string;
  secondaryHex: string;
  accentHex: string;
  bgHex: string;
  cardBgHex: string;
  borderHex: string;
  glowRgba: string;
  headingGradient: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  mocha_mousse: {
    id: 'mocha_mousse',
    name: "Mocha Mousse (Pantone's Color of the Year)",
    tagline: "Pantone 17-1230: Warm Velvet Espresso, Toasted Caramel & Froth Cream",
    colorsDescription: 'Mocha Mousse (#A47764), Toasted Caramel (#C59B82) & Warm Froth Cream (#F8EDE3)',
    vibe: 'Comforting, velvety, rich espresso warmth, and understated luxury',
    bestFor: 'Sophisticated gaming lounges, wood-finish desks, and warm studio lighting',
    primaryHex: '#A47764',
    secondaryHex: '#C59B82',
    accentHex: '#F8EDE3',
    bgHex: '#140F0D',
    cardBgHex: '#1E1613',
    borderHex: 'rgba(164, 119, 100, 0.35)',
    glowRgba: 'rgba(164, 119, 100, 0.28)',
    headingGradient: 'from-[#F8EDE3] via-[#D8A78F] to-[#A47764]',
  },
  teal_cream: {
    id: 'teal_cream',
    name: 'Teal and Cream',
    tagline: 'Radiant Oceanic Teal, Seafoam & Velvet Cream',
    colorsDescription: 'Luminous Electric Teal (#14B8A6), Deep Petrol (#0D9488) & Velvet Cream (#FDFBF7)',
    vibe: 'Deep oceanic abyss, maritime serenity, and high-contrast ivory sheen',
    bestFor: 'Ultrawide setups, calm focused workstations, and clean modern aesthetics',
    primaryHex: '#14B8A6',
    secondaryHex: '#0D9488',
    accentHex: '#FDFBF7',
    bgHex: '#061316',
    cardBgHex: '#0C1E23',
    borderHex: 'rgba(20, 184, 166, 0.35)',
    glowRgba: 'rgba(20, 184, 166, 0.26)',
    headingGradient: 'from-[#FDFBF7] via-[#2DD4BF] to-[#0D9488]',
  },
  deep_purple_orange: {
    id: 'deep_purple_orange',
    name: 'Deep Purple with Orange Accents',
    tagline: 'Midnight Obsidian Violet with Fiery Neon Orange Accents',
    colorsDescription: 'Electric Amethyst (#A855F7), Imperial Violet (#7E22CE) & Blaze Orange (#F97316)',
    vibe: 'Galactic nebula intensity, obsidian shadows, and burning neon flame highlights',
    bestFor: 'Late-night competitive esports, RGB battlestations, and high-energy builds',
    primaryHex: '#A855F7',
    secondaryHex: '#7E22CE',
    accentHex: '#F97316',
    bgHex: '#0B0616',
    cardBgHex: '#130B24',
    borderHex: 'rgba(249, 115, 22, 0.40)',
    glowRgba: 'rgba(249, 115, 22, 0.28)',
    headingGradient: 'from-[#FB923C] via-[#F97316] to-[#C084FC]',
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Titanium',
    tagline: 'Deep Titanium, Electric Blue & Neon Violet Accents',
    colorsDescription: 'Dark Titanium & Graphite with Electric Blue (#00D2FF) & Neon Violet (#8B5CF6)',
    vibe: 'High-end hardware lab, titanium chassis, and esports telemetry',
    bestFor: 'Enthusiast gaming setups, GPU benchmarking, and precision PC building',
    primaryHex: '#00D2FF',
    secondaryHex: '#8B5CF6',
    accentHex: '#06B6D4',
    bgHex: '#07090e',
    cardBgHex: '#10141f',
    borderHex: 'rgba(0, 210, 255, 0.22)',
    glowRgba: 'rgba(0, 210, 255, 0.16)',
    headingGradient: 'from-cyan-400 via-sky-200 to-violet-400',
  },
  matrix: {
    id: 'matrix',
    name: 'Matrix / Stealth Green',
    tagline: 'Tactical Emerald & Matte Charcoal',
    colorsDescription: 'Vibrant Neon Green (#00FF7F) & Matte Charcoal (#0F1115)',
    vibe: 'Hacking, tactical, and classic arcade terminal',
    bestFor: 'Streamer backdrops, mechanical keyboard accents, and minimalist dark rooms',
    primaryHex: '#00FF7F',
    secondaryHex: '#10B981',
    accentHex: '#34D399',
    bgHex: '#070908',
    cardBgHex: '#0e1310',
    borderHex: 'rgba(0, 255, 127, 0.18)',
    glowRgba: 'rgba(0, 255, 127, 0.15)',
    headingGradient: 'from-emerald-300 via-green-400 to-teal-300',
  },
  synthwave: {
    id: 'synthwave',
    name: 'Synthwave / Retro Arcade',
    tagline: 'Warm Violet, Magenta & Amber Glow',
    colorsDescription: 'Rose Pink, Soft Purple & Electric Amber',
    vibe: '80s arcade nostalgia, synth-pop, and refined vapor',
    bestFor: 'Neon wall signs, retro-themed wallpapers, and ambient LED lighting',
    primaryHex: '#F43F5E',
    secondaryHex: '#A855F7',
    accentHex: '#FBBF24',
    bgHex: '#0b0813',
    cardBgHex: '#130f21',
    borderHex: 'rgba(244, 63, 94, 0.18)',
    glowRgba: 'rgba(244, 63, 94, 0.15)',
    headingGradient: 'from-rose-400 via-purple-400 to-amber-300',
  },
  deep_space: {
    id: 'deep_space',
    name: 'Deep Space Purple',
    tagline: 'Cosmic Indigo, Soft Sky & Violet Highlights',
    colorsDescription: 'Ultraviolet, Deep Indigo & Soft Pastel Blue',
    vibe: 'Immersive, relaxing, and cosmic',
    bestFor: 'Late-night gaming sessions, reducing eye strain, and fantasy aesthetics',
    primaryHex: '#A855F7',
    secondaryHex: '#6366F1',
    accentHex: '#38BDF8',
    bgHex: '#080712',
    cardBgHex: '#100e21',
    borderHex: 'rgba(168, 85, 247, 0.18)',
    glowRgba: 'rgba(168, 85, 247, 0.15)',
    headingGradient: 'from-purple-300 via-indigo-400 to-sky-300',
  },
  forest_calm: {
    id: 'forest_calm',
    name: 'Forest Calm (Anti-Esports)',
    tagline: 'Earthy Pine, Warm Ochre & Cream',
    colorsDescription: 'Deep Pine Green (#1B4332), Warm Wood (#D4A373) & Cream (#FEFAE0)',
    vibe: 'Earthy, grounded, and cozy',
    bestFor: 'Casual gamers who want a mature space that doubles as a comfortable home office',
    primaryHex: '#D4A373',
    secondaryHex: '#2D6A4F',
    accentHex: '#FEFAE0',
    bgHex: '#090d0b',
    cardBgHex: '#111814',
    borderHex: 'rgba(212, 163, 115, 0.18)',
    glowRgba: 'rgba(45, 106, 79, 0.15)',
    headingGradient: 'from-amber-200 via-emerald-300 to-amber-100',
  },
};
