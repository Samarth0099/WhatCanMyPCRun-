export interface GamerUser {
  id: string;
  name: string;
  gamerTag: string;
  email: string;
  avatarUrl: string;
  rank: string;
  level: number;
  memberSince: string;
  savedBuilds: string[]; // names or serialized queries
}

const STORAGE_KEY = 'pc_can_run_auth_user';
const USERS_LIST_KEY = 'pc_can_run_registered_users';

export const DEFAULT_DEMO_USER: GamerUser = {
  id: 'gamer-001',
  name: 'Alex Mercer',
  gamerTag: 'CyberViper_99',
  email: 'alex.viper@nexusgaming.io',
  avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
  rank: 'ELITE RIG ARCHITECT',
  level: 42,
  memberSince: '2024',
  savedBuilds: ['RTX 4080 Super Ultra', 'Budget 1080p Esports Beast'],
};

export const authService = {
  getCurrentUser(): GamerUser | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: GamerUser | null): void {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: user }));
  },

  login(email: string, _password?: string): GamerUser {
    const existing = this.getCurrentUser();
    if (existing && existing.email.toLowerCase() === email.toLowerCase()) {
      return existing;
    }
    // Generate or fetch user
    const gamerTag = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '') || 'GamerZero';
    const user: GamerUser = {
      id: `usr-${Date.now()}`,
      name: gamerTag.charAt(0).toUpperCase() + gamerTag.slice(1),
      gamerTag: `${gamerTag}_${Math.floor(100 + Math.random() * 900)}`,
      email,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      rank: 'RIG SPECIALIST',
      level: 18,
      memberSince: new Date().getFullYear().toString(),
      savedBuilds: ['My First Custom PC'],
    };
    this.setCurrentUser(user);
    return user;
  },

  loginWithGoogle(): GamerUser {
    const user: GamerUser = {
      id: `google-${Date.now()}`,
      name: 'Google Gamer',
      gamerTag: 'QuantumPixel',
      email: 'player@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      rank: 'OVERCLOCKER PRO',
      level: 27,
      memberSince: new Date().getFullYear().toString(),
      savedBuilds: ['Ultra 4K RayTracing Beast'],
    };
    this.setCurrentUser(user);
    return user;
  },

  register(name: string, email: string, _password?: string): GamerUser {
    const gamerTag = name.replace(/\s+/g, '_') || 'GamerPro';
    const user: GamerUser = {
      id: `usr-${Date.now()}`,
      name,
      gamerTag,
      email,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rank: 'NOVICE OVERCLOCKER',
      level: 1,
      memberSince: new Date().getFullYear().toString(),
      savedBuilds: [],
    };
    this.setCurrentUser(user);
    return user;
  },

  loginDemo(): GamerUser {
    this.setCurrentUser(DEFAULT_DEMO_USER);
    return DEFAULT_DEMO_USER;
  },

  logout(): void {
    this.setCurrentUser(null);
  },
};
