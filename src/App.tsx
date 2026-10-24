import React, { useState, useEffect, useMemo } from 'react';
import { SystemBuild } from './types/hardware';
import { Game, Resolution, QualityPreset, UpscalerMode, VerdictBadge } from './types/game';
import { ThemeId, THEMES } from './types/theme';
import { CPUS_DATABASE } from './data/cpus';
import { GPUS_DATABASE } from './data/gpus';
import { GAMES_DATABASE } from './data/games';
import { PREBUILT_SYSTEMS, findCpu, findGpu } from './data/otherHardware';
import { estimateGamePerformance, analyzeSystemCompatibility } from './services/estimationEngine';
import { serializeBuildToQuery, parseBuildFromUrl } from './services/buildSerializer';

import { Header } from './components/Header';
import { HeroPage } from './components/HeroPage';
import { BuilderProgressNav, BuilderStep } from './components/BuilderProgressNav';
import { PersistentBuildSummary } from './components/PersistentBuildSummary';
import { CpuSelectionPage } from './components/builder/CpuSelectionPage';
import { GpuSelectionPage } from './components/builder/GpuSelectionPage';
import { MotherboardSelectionPage } from './components/builder/MotherboardSelectionPage';
import { RamSelectionPage } from './components/builder/RamSelectionPage';
import { StorageSelectionPage } from './components/builder/StorageSelectionPage';
import { CoolerSelectionPage } from './components/builder/CoolerSelectionPage';

import { GamingSearchBar } from './components/GamingSearchBar';
import { CompatibilityBanner } from './components/CompatibilityBanner';
import { GameFilterBar } from './components/GameFilterBar';
import { GameCard } from './components/GameCard';
import { GameCardSkeletonGrid } from './components/GameCardSkeleton';
import { GameSettingsModal } from './components/GameSettingsModal';
import { BuildCompareModal } from './components/BuildCompareModal';
import { CompareView } from './components/CompareView';
import { AuthModal } from './components/AuthModal';
import { AuthView, AuthMode } from './components/AuthView';
import { SeoLookupModal } from './components/SeoLookupModal';
import { CustomPartModal } from './components/CustomPartModal';
import { TargetFpsPanel } from './components/TargetFpsPanel';
import { ThemeSelector } from './components/ThemeSelector';
import { InteractiveRigCanvas } from './components/InteractiveRigCanvas';
import { FuturisticBackground } from './components/FuturisticBackground';
import { ScrollReveal } from './components/ScrollReveal';
import { authService, GamerUser } from './services/authService';
import { Check, Sparkles, Hammer, Settings2, Home, Monitor } from 'lucide-react';

export default function App() {
  // 1. Theme State (Mocha Mousse, Teal and Cream, Deep Purple with Orange Accents)
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pc_can_run_theme') as ThemeId;
      if (saved && (saved === 'mocha_mousse' || saved === 'teal_cream' || saved === 'deep_purple_orange')) {
        return saved;
      }
      if (saved && THEMES[saved] && saved !== 'cyberpunk') {
        return saved;
      }
    }
    return 'mocha_mousse'; // Default to Mocha Mousse (Pantone's Color of the Year)
  });

  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  // Synchronize data-theme on document root and body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.body.setAttribute('data-theme', currentTheme);
    localStorage.setItem('pc_can_run_theme', currentTheme);
  }, [currentTheme]);

  // Mandatory User Authentication State
  const [currentUser, setCurrentUser] = useState<GamerUser | null>(() => authService.getCurrentUser());
  const [intendedStep, setIntendedStep] = useState<BuilderStep>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const stepParam = params.get('step') as BuilderStep;
      if (stepParam && ['hero', 'cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooler', 'results', 'compare'].includes(stepParam)) {
        return stepParam;
      }
      if (params.get('gpu') && params.get('cpu')) {
        return 'results';
      }
    }
    return 'results';
  });

  // Current Multi-Page Builder Step: hero -> cpu -> gpu -> motherboard -> ram -> storage -> cooler -> results -> compare -> auth
  // Mandatory Login Requirement: unauthenticated visitors must encounter the Login page first
  const [currentStep, setCurrentStepRaw] = useState<BuilderStep>(() => {
    const existingUser = authService.getCurrentUser();
    if (!existingUser) {
      return 'auth'; // Guard: visitor must sign in first
    }
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#auth' || hash === '#login' || hash === '#signup') {
        return 'auth';
      }
      if (hash === '#benchmarks') {
        return 'results';
      }
      const params = new URLSearchParams(window.location.search);
      const stepParam = params.get('step');
      if (stepParam === 'benchmarks') {
        return 'results';
      }
      if (stepParam && ['hero', 'cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooler', 'results', 'compare', 'auth'].includes(stepParam)) {
        return stepParam as BuilderStep;
      }
      // If user came with explicit gpu & cpu query, jump directly to results
      if (params.get('gpu') && params.get('cpu')) {
        return 'results';
      }
    }
    return 'hero';
  });

  // Safe navigation function: protects all internal routes against unauthorized access
  const setCurrentStep = (step: BuilderStep) => {
    const activeUser = authService.getCurrentUser();
    if (!activeUser && step !== 'auth') {
      setIntendedStep(step);
      setCurrentStepRaw('auth');
      showToast('Please sign in to access the PC Builder & Performance Lab');
      return;
    }
    setCurrentStepRaw(step);
  };

  // Synchronize auth state and listen for login/logout across tabs/components
  useEffect(() => {
    const handleAuthChange = (e: Event) => {
      const custom = e as CustomEvent<GamerUser | null>;
      const user = custom.detail !== undefined ? custom.detail : authService.getCurrentUser();
      setCurrentUser(user);
      if (!user) {
        // Returned to login page and protect all private routes again
        setCurrentStepRaw('auth');
      }
    };
    window.addEventListener('auth-state-changed', handleAuthChange);
    return () => window.removeEventListener('auth-state-changed', handleAuthChange);
  }, []);

  // Listen for hash navigation changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#auth' || hash === '#login') {
        setAuthMode('login');
        setCurrentStepRaw('auth');
      } else if (hash === '#signup') {
        setAuthMode('signup');
        setCurrentStepRaw('auth');
      } else if (hash === '#compare') {
        setCurrentStep('compare');
      } else if (hash === '#benchmarks') {
        setCurrentStep('results');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [currentUser]);

  // 2. Hardware Build State hydrated from URL or Default Rig
  const [build, setBuild] = useState<SystemBuild>(() => {
    const urlBuild = parseBuildFromUrl();
    const defaultBuild = PREBUILT_SYSTEMS[0].build; // Mainstream 1440p Sweet Spot
    return {
      ...defaultBuild,
      ...urlBuild,
    };
  });

  // Track completed steps for progress bar
  const completedSteps = useMemo(() => {
    return {
      cpu: !!build.cpu,
      gpu: !!build.gpu,
      motherboard: !!build.motherboard,
      ram: !!build.ram,
      storage: !!build.storage,
      cooler: !!build.cooler,
      results: true,
    };
  }, [build]);

  // Display & Estimation Controls
  const [resolution, setResolution] = useState<Resolution>('1440p');
  const [preset, setPreset] = useState<QualityPreset>('High');
  const [upscaler, setUpscaler] = useState<UpscalerMode>('Off');

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudio, setSelectedStudio] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedVerdict, setSelectedVerdict] = useState<VerdictBadge | 'All'>('All');
  
  // Favorite Games State
  const [favoriteGameIds, setFavoriteGameIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('user_favorite_games');
        return saved ? JSON.parse(saved) : ['cyberpunk-2077', 'elden-ring', 'grand-theft-auto-v'];
      } catch {
        return ['cyberpunk-2077', 'elden-ring'];
      }
    }
    return ['cyberpunk-2077', 'elden-ring'];
  });
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('user_favorite_games', JSON.stringify(favoriteGameIds));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [favoriteGameIds]);

  const toggleFavoriteGame = (gameId: string) => {
    setFavoriteGameIds(prev => {
      const isAlready = prev.includes(gameId);
      const next = isAlready ? prev.filter(id => id !== gameId) : [...prev, gameId];
      const targetGame = GAMES_DATABASE.find(g => g.id === gameId);
      const title = targetGame ? targetGame.title : 'Game';
      showToast(isAlready ? `Removed "${title}" from favorites` : `★ Added "${title}" to favorites!`);
      return next;
    });
  };

  // Tab State
  const [activeTab, setActiveTab] = useState<'games' | 'target_fps'>('games');

  // Modals
  const [selectedGameForSettings, setSelectedGameForSettings] = useState<Game | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isSeoOpen, setIsSeoOpen] = useState(false);
  const [seoGpuId, setSeoGpuId] = useState<string | undefined>();
  const [seoGameId, setSeoGameId] = useState<string | undefined>();
  const [isCustomPartOpen, setIsCustomPartOpen] = useState(false);

  // TV Mode & Share Toast
  const [tvMode, setTvMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Subtle calculation / skeleton state to prevent layout shifts
  const [isCalculating, setIsCalculating] = useState(false);

  // Trigger smooth skeleton pulse when hardware or target parameters change
  useEffect(() => {
    if (currentStep === 'results') {
      setIsCalculating(true);
      const timer = setTimeout(() => {
        setIsCalculating(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [
    currentStep,
    build.gpu.id,
    build.cpu.id,
    build.ram.capacityGb,
    build.ram.type,
    build.monitor.resolution,
    resolution,
    preset,
    upscaler,
    searchQuery,
    selectedStudio,
    selectedGenre,
    selectedVerdict,
  ]);

  // Synchronize TV mode body class
  useEffect(() => {
    if (tvMode) {
      document.body.classList.add('tv-mode');
    } else {
      document.body.classList.remove('tv-mode');
    }
  }, [tvMode]);

  // Check URL Hash for deep-link SEO modal e.g. #/gpu/:gpuId/game/:gameId
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const match = hash.match(/#\/gpu\/([^/]+)\/game\/([^/]+)/);
      if (match) {
        setSeoGpuId(match[1]);
        setSeoGameId(match[2]);
        setIsSeoOpen(true);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // TV 10-Foot Mode Keyboard Navigation Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.key === 't' || e.key === 'T') {
        setTvMode(prev => !prev);
      } else if (e.key === 'Escape') {
        setSelectedGameForSettings(null);
        setIsCompareOpen(false);
        setIsSeoOpen(false);
        setIsCustomPartOpen(false);
        setIsThemeSelectorOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Show temporary toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleShareBuild = () => {
    const queryString = serializeBuildToQuery(build);
    const fullUrl = `${window.location.origin}${window.location.pathname}?${queryString}&step=${currentStep}`;
    window.history.replaceState(null, '', `?${queryString}&step=${currentStep}`);
    navigator.clipboard.writeText(fullUrl);
    showToast('Build URL copied to clipboard! Anyone opening this link will see your exact PC specs.');
  };

  // Compatibility Analysis
  const compatibilityIssues = useMemo(() => {
    return analyzeSystemCompatibility(build);
  }, [build]);

  // Unique Studios & Genres for filtering
  const studios = useMemo(() => {
    const s = new Set<string>();
    GAMES_DATABASE.forEach(g => s.add(g.studio));
    return Array.from(s).sort();
  }, []);

  const genres = useMemo(() => {
    const set = new Set<string>();
    GAMES_DATABASE.forEach(g => {
      g.genre.split('/').forEach(item => set.add(item.trim()));
    });
    return Array.from(set).sort();
  }, []);

  // Filtered Game Estimates
  const gameEstimates = useMemo(() => {
    return GAMES_DATABASE.map(game => {
      return estimateGamePerformance({
        game,
        cpu: build.cpu,
        gpu: build.gpu,
        ram: build.ram,
        storage: build.storage,
        cooler: build.cooler,
        resolution,
        preset,
        upscaler,
      });
    }).filter(est => {
      const matchesSearch = est.game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            est.game.studio.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStudio = selectedStudio === 'All' || est.game.studio === selectedStudio;
      const matchesGenre = selectedGenre === 'All' || est.game.genre.includes(selectedGenre);
      const matchesVerdict = selectedVerdict === 'All' || est.verdict === selectedVerdict;
      const matchesFavorite = !favoritesOnly || favoriteGameIds.includes(est.game.id);
      return matchesSearch && matchesStudio && matchesGenre && matchesVerdict && matchesFavorite;
    });
  }, [build, resolution, preset, upscaler, searchQuery, selectedStudio, selectedGenre, selectedVerdict, favoritesOnly, favoriteGameIds]);

  const activeThemeObj = THEMES[currentTheme] || THEMES.mocha_mousse;

  // Handler for reset build
  const handleResetBuild = () => {
    const defaultBuild = PREBUILT_SYSTEMS[0].build;
    setBuild(defaultBuild);
    showToast('Reset to default balanced gaming PC.');
  };

  return (
    <div
      data-theme={currentTheme}
      className="min-h-screen flex flex-col cyber-titanium-grid relative transition-colors duration-300"
      style={{ backgroundColor: activeThemeObj.bgHex, color: '#f1f5f9' }}
    >
      {/* 1. Layered Futuristic Gaming Environment Background */}
      <FuturisticBackground currentTheme={currentTheme} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121622] text-white border border-cyan-400/50 px-4 py-2.5 rounded-xl shadow-2xl font-mono text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-cyan-400 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        onSelectPrebuilt={(newBuild) => {
          setBuild(newBuild);
          showToast(`Loaded ${newBuild.name}!`);
          setCurrentStep('results');
        }}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenSeoLookup={() => {
          setSeoGpuId(build.gpu.id);
          setIsSeoOpen(true);
        }}
        onShareBuild={handleShareBuild}
        tvMode={tvMode}
        onToggleTvMode={() => setTvMode(!tvMode)}
        currentTheme={currentTheme}
        onSelectTheme={(themeId) => {
          setCurrentTheme(themeId);
          showToast(`Switched theme to ${THEMES[themeId].name}!`);
        }}
        onOpenThemeSelector={() => setIsThemeSelectorOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentStep={currentStep}
        onSelectStep={setCurrentStep}
        onOpenAuth={(mode) => {
          setAuthMode(mode || 'login');
          setIsAuthOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!currentUser ? (
          <div className="w-full space-y-4 animate-fade-in">
            {/* Unauthenticated Security Gate Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-[#0c101b]/95 border border-white/[0.08] backdrop-blur-xl text-xs font-mono shadow-lg">
              <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-cyan-400 diode-pulse" />
                <span>RIGLAB · MANDATORY GAMER AUTHENTICATION</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Please sign in to access the PC Builder, FPS Estimator & Games Library
              </div>
            </div>

            <AuthView
              initialMode={authMode}
              currentTheme={currentTheme}
              onSuccess={(user) => {
                setCurrentUser(user);
                showToast(`Authenticated as ${user.gamerTag}! Welcome to RigLab.`);
                const destination = intendedStep || 'results';
                setCurrentStep(destination);
              }}
              onClose={() => {
                showToast('Please sign in or create an account to enter the platform');
              }}
            />
          </div>
        ) : (
          <>
            {/* Step Progress Bar (Shown ONLY during component selection and results) */}
            {['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooler', 'results'].includes(currentStep) && (
              <BuilderProgressNav
                currentStep={currentStep}
                currentTheme={currentTheme}
                onSelectStep={setCurrentStep}
                completedSteps={completedSteps}
              />
            )}

        {/* 1. HERO PAGE */}
        {currentStep === 'hero' && (
          <HeroPage
            currentTheme={currentTheme}
            onStartBuild={() => setCurrentStep('cpu')}
            onExplorePrebuilts={() => {
              setBuild(PREBUILT_SYSTEMS[0].build);
              setCurrentStep('cpu');
              showToast('Starting PC builder with Sweet Spot baseline!');
            }}
            onJumpToResults={() => setCurrentStep('results')}
            onOpenAuth={() => {
              setAuthMode('login');
              setCurrentStep('auth');
            }}
          />
        )}

        {/* 2. COMPONENT SELECTION PAGES (CPU, GPU, Motherboard, RAM, Storage, Cooler) */}
        {['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooler'].includes(currentStep) && (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Center: Component Selector Page */}
            <div className="flex-1 w-full min-w-0">
              {currentStep === 'cpu' && (
                <CpuSelectionPage
                  selectedCpu={build.cpu}
                  onSelectCpu={(newCpu) => {
                    setBuild(prev => ({ ...prev, cpu: newCpu }));
                    showToast(`Selected ${newCpu.brand} ${newCpu.model}`);
                  }}
                  onBack={() => setCurrentStep('hero')}
                  onContinue={() => setCurrentStep('gpu')}
                  currentTheme={currentTheme}
                />
              )}

              {currentStep === 'gpu' && (
                <GpuSelectionPage
                  selectedGpu={build.gpu}
                  onSelectGpu={(newGpu) => {
                    setBuild(prev => ({ ...prev, gpu: newGpu }));
                    showToast(`Selected ${newGpu.model}`);
                  }}
                  onBack={() => setCurrentStep('cpu')}
                  onContinue={() => setCurrentStep('motherboard')}
                  currentTheme={currentTheme}
                />
              )}

              {currentStep === 'motherboard' && (
                <MotherboardSelectionPage
                  selectedMotherboard={build.motherboard}
                  selectedCpu={build.cpu}
                  onSelectMotherboard={(newMobo) => {
                    setBuild(prev => ({ ...prev, motherboard: newMobo }));
                    showToast(`Selected ${newMobo.brand} ${newMobo.model}`);
                  }}
                  onBack={() => setCurrentStep('gpu')}
                  onContinue={() => setCurrentStep('ram')}
                  currentTheme={currentTheme}
                />
              )}

              {currentStep === 'ram' && (
                <RamSelectionPage
                  selectedRam={build.ram}
                  selectedMotherboard={build.motherboard}
                  onSelectRam={(newRam) => {
                    setBuild(prev => ({ ...prev, ram: newRam }));
                    showToast(`Selected ${newRam.capacityGb}GB ${newRam.type}-${newRam.speedMhz}`);
                  }}
                  onBack={() => setCurrentStep('motherboard')}
                  onContinue={() => setCurrentStep('storage')}
                  currentTheme={currentTheme}
                />
              )}

              {currentStep === 'storage' && (
                <StorageSelectionPage
                  selectedStorage={build.storage}
                  onSelectStorage={(newStorage) => {
                    setBuild(prev => ({ ...prev, storage: newStorage }));
                    showToast(`Selected ${newStorage.name}`);
                  }}
                  onBack={() => setCurrentStep('ram')}
                  onContinue={() => setCurrentStep('cooler')}
                  currentTheme={currentTheme}
                />
              )}

              {currentStep === 'cooler' && (
                <CoolerSelectionPage
                  selectedCooler={build.cooler}
                  selectedCpu={build.cpu}
                  onSelectCooler={(newCooler) => {
                    setBuild(prev => ({ ...prev, cooler: newCooler }));
                    showToast(`Selected ${newCooler.model}`);
                  }}
                  onBack={() => setCurrentStep('storage')}
                  onSkip={() => setCurrentStep('results')}
                  onContinue={() => setCurrentStep('results')}
                  currentTheme={currentTheme}
                />
              )}
            </div>

            {/* Right: Persistent Build Summary Panel */}
            <PersistentBuildSummary
              build={build}
              currentStep={currentStep}
              currentTheme={currentTheme}
              onNavigateToStep={setCurrentStep}
              onResetBuild={handleResetBuild}
              onViewResults={() => setCurrentStep('results')}
            />
          </div>
        )}

        {/* GAMES LIBRARY PAGE */}
        {currentStep === 'compare' && (
          <div className="w-full">
            <CompareView
              baseBuild={build}
              currentTheme={currentTheme}
              onClose={() => setCurrentStep('results')}
              onNavigateToBuilder={(step) => setCurrentStep((step as any) || 'cpu')}
              onUpdateBuild={(newBuild) => setBuild(newBuild)}
              favoriteGameIds={favoriteGameIds}
              onToggleFavorite={toggleFavoriteGame}
            />
          </div>
        )}

        {/* AUTHENTICATION / LOGIN / SIGNUP PAGE */}
        {currentStep === 'auth' && (
          <div className="w-full space-y-4 animate-fade-in">
            {/* Quick Breadcrumb Navigation Bar for Tablet and Desktop */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-[#0c101b]/95 border border-white/[0.08] backdrop-blur-xl text-xs font-mono shadow-lg">
              <div className="flex items-center gap-2 text-slate-400">
                <button
                  onClick={() => setCurrentStep('hero')}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-bold">HOME</span>
                </button>
                <span className="text-slate-600">/</span>
                <span className="text-cyan-400 font-bold uppercase tracking-wider">
                  {authMode === 'login' ? 'Gamer Sign In' : authMode === 'signup' ? 'Create Account' : 'Password Recovery'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStep('cpu')}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 transition-all flex items-center gap-1.5 cursor-pointer font-bold"
                >
                  <Hammer className="w-3.5 h-3.5" />
                  <span>PC Builder</span>
                </button>
                <button
                  onClick={() => setCurrentStep('results')}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>FPS Estimator</span>
                </button>
              </div>
            </div>

            <AuthView
              initialMode={authMode}
              currentTheme={currentTheme}
              onSuccess={(user) => {
                setCurrentUser(user);
                showToast(`Authenticated as ${user.gamerTag}! Welcome to RigLab.`);
                const destination = intendedStep || 'results';
                setCurrentStep(destination);
              }}
              onClose={() => {
                if (currentUser) {
                  setCurrentStep('hero');
                } else {
                  showToast('Please sign in or create an account to enter the platform');
                }
              }}
            />
          </div>
        )}

        {/* 3. RESULTS PAGE — WHAT CAN MY PC RUN? */}
        {currentStep === 'results' && (
          <div className="w-full">
            {/* Interactive 3D Hardware Rig Showcase Bar */}
            <ScrollReveal variant="fade" delayMs={30} className="mb-6">
              <InteractiveRigCanvas
                primaryHex={activeThemeObj.primaryHex}
                secondaryHex={activeThemeObj.secondaryHex}
                cpuName={`${build.cpu.brand} ${build.cpu.model}`}
                gpuName={build.gpu.model}
                ramText={`${build.ram.capacityGb}GB ${build.ram.type}`}
                coolerText={build.cooler ? build.cooler.model : 'High Performance Cooler'}
                isCompact={true}
              />
            </ScrollReveal>

            {/* Results Header / Equipped Rig Recap Banner */}
            <ScrollReveal variant="slide-up" delayMs={60}>
              <div className="titanium-card p-4 sm:p-5 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl select-none">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 diode-pulse" />
                    <span>CALIBRATED HARDWARE PERFORMANCE LAB</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-white flex items-center gap-2 flex-wrap">
                    <span>{build.gpu.model}</span>
                    <span className="text-slate-500 font-normal">+</span>
                    <span style={{ color: activeThemeObj.primaryHex }}>{build.cpu.model}</span>
                  </h2>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-2.5 flex-wrap font-mono">
                    <span>RAM: {build.ram.capacityGb}GB {build.ram.type}</span>
                    <span>•</span>
                    <span>Mobo: {build.motherboard ? build.motherboard.model.split(' ').slice(0, 3).join(' ') : 'Standard'}</span>
                    <span>•</span>
                    <span>Storage: {build.storage ? `${build.storage.capacityGb >= 1000 ? `${build.storage.capacityGb/1000}TB` : `${build.storage.capacityGb}GB`} SSD` : 'SSD'}</span>
                  </div>
                </div>

                {/* Action Buttons to Edit or Re-customize */}
                <div className="flex items-center gap-2 self-stretch md:self-auto">
                  <button
                    onClick={() => setCurrentStep('cpu')}
                    className="btn-titanium-primary flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Hammer className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                    <span>Edit Components</span>
                  </button>

                  <button
                    onClick={() => setIsCustomPartOpen(true)}
                    className="btn-titanium-secondary px-3 py-2 rounded-xl text-xs font-heading font-medium text-slate-300 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Tune custom clock/VRAM"
                  >
                    <Settings2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden sm:inline">Advanced Tuning</span>
                  </button>
                </div>
              </div>
            </ScrollReveal>

            {/* Compatibility and Bottleneck Banner */}
            <ScrollReveal variant="fade" delayMs={80}>
              <CompatibilityBanner
                issues={compatibilityIssues}
                build={build}
              />
            </ScrollReveal>

            {/* Smart Search Capsule & Instant Hardware Swap Bar */}
            <ScrollReveal variant="slide-up" delayMs={100}>
              <GamingSearchBar
                build={build}
                onUpdateBuild={setBuild}
                onSelectGame={(game) => setSelectedGameForSettings(game)}
                onOpenCustomPartModal={() => setIsCustomPartOpen(true)}
                onOpenCompare={() => setIsCompareOpen(true)}
              />
            </ScrollReveal>

            {/* Tab 1: Game Library Explorer */}
            {activeTab === 'games' && (
              <div className="mt-8">
                {/* Filter Bar */}
                <GameFilterBar
                  resolution={resolution}
                  onChangeResolution={setResolution}
                  preset={preset}
                  onChangePreset={setPreset}
                  upscaler={upscaler}
                  onChangeUpscaler={setUpscaler}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedStudio={selectedStudio}
                  onSelectStudio={setSelectedStudio}
                  selectedGenre={selectedGenre}
                  onSelectGenre={setSelectedGenre}
                  selectedVerdict={selectedVerdict}
                  onSelectVerdict={setSelectedVerdict}
                  studios={studios}
                  genres={genres}
                  gpuSupportsDlss={build.gpu.supportsDLSS}
                  gpuSupportsDlss3Fg={build.gpu.supportsDLSS3FrameGen}
                  favoritesOnly={favoritesOnly}
                  onToggleFavoritesOnly={setFavoritesOnly}
                  favoriteCount={favoriteGameIds.length}
                />

                {/* Results Count & Engine Disclaimer */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-5 px-1 font-mono">
                  <div className="flex items-center gap-2">
                    {isCalculating ? (
                      <span className="flex items-center gap-2 text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                        <span>Processing hardware benchmark projections...</span>
                      </span>
                    ) : (
                      <div>
                        Showing <span className="font-bold text-white">{gameEstimates.length}</span> {favoritesOnly ? 'favorite ' : ''}games at{' '}
                        <span className="font-bold" style={{ color: activeThemeObj.primaryHex }}>{resolution} {preset}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 hidden sm:block">
                    Hardware telemetry interpolation · VRAM overflow calculation active
                  </div>
                </div>

                {/* Games Grid with Skeleton State */}
                {isCalculating ? (
                  <GameCardSkeletonGrid count={gameEstimates.length > 0 ? Math.min(Math.max(gameEstimates.length, 3), 6) : 6} />
                ) : gameEstimates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                    {gameEstimates.map((estimate, idx) => (
                      <GameCard
                        key={estimate.game.id}
                        estimate={estimate}
                        index={idx}
                        onOpenSettings={() => setSelectedGameForSettings(estimate.game)}
                        onOpenSeoDetails={() => {
                          setSeoGpuId(build.gpu.id);
                          setSeoGameId(estimate.game.id);
                          setIsSeoOpen(true);
                        }}
                        tvMode={tvMode}
                        isFavorite={favoriteGameIds.includes(estimate.game.id)}
                        onToggleFavorite={() => toggleFavoriteGame(estimate.game.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-16 text-center bg-[#10141e] rounded-2xl border border-white/[0.07] my-10">
                    <p className="text-base font-semibold text-slate-200">
                      {favoritesOnly ? 'No favorite games saved yet.' : 'No games matched your current filters.'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1.5 max-w-md mx-auto">
                      {favoritesOnly
                        ? 'Click the star icon on any game card to add it to your favorite games list.'
                        : 'Try resetting the studio or verdict filter, or clearing your search query.'}
                    </p>
                    <button
                      onClick={() => {
                        setFavoritesOnly(false);
                        setSearchQuery('');
                        setSelectedStudio('All');
                        setSelectedGenre('All');
                        setSelectedVerdict('All');
                      }}
                      className="mt-4 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold transition-all border border-white/[0.08]"
                      style={{ color: activeThemeObj.primaryHex }}
                    >
                      {favoritesOnly ? 'Show All Games' : 'Reset All Filters'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Target FPS Mode */}
            {activeTab === 'target_fps' && (
              <div className="mt-8">
                <TargetFpsPanel
                  build={build}
                  onOpenSettings={(game) => setSelectedGameForSettings(game)}
                />
              </div>
            )}
          </div>
        )}
          </>
        )}
      </main>

      {/* Theme Selector Modal */}
      <ThemeSelector
        currentTheme={currentTheme}
        onSelectTheme={(themeId) => {
          setCurrentTheme(themeId);
          showToast(`Switched to ${THEMES[themeId].name}!`);
        }}
        isOpen={isThemeSelectorOpen}
        onClose={() => setIsThemeSelectorOpen(false)}
      />

      {/* In-Game Settings Optimization Modal */}
      {selectedGameForSettings && (
        <GameSettingsModal
          isOpen={!!selectedGameForSettings}
          onClose={() => setSelectedGameForSettings(null)}
          game={selectedGameForSettings}
          estimate={gameEstimates.find(e => e.game.id === selectedGameForSettings.id) || null}
          build={build}
        />
      )}

      {/* Side-by-Side Compare Modal */}
      <BuildCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        baseBuild={build}
        currentTheme={currentTheme}
        onNavigateToBuilder={(step) => setCurrentStep((step as any) || 'cpu')}
        onUpdateBuild={(newBuild) => setBuild(newBuild)}
        favoriteGameIds={favoriteGameIds}
        onToggleFavorite={toggleFavoriteGame}
      />

      {/* SEO / Can [GPU] Run [Game] Modal */}
      <SeoLookupModal
        isOpen={isSeoOpen}
        onClose={() => {
          setIsSeoOpen(false);
          if (window.location.hash.startsWith('#/gpu/')) {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }}
        initialGpuId={seoGpuId}
        initialGameId={seoGameId}
      />

      {/* Custom Part Modal */}
      <CustomPartModal
        isOpen={isCustomPartOpen}
        onClose={() => setIsCustomPartOpen(false)}
        build={build}
        onApplyCustom={(newBuild) => {
          setBuild(newBuild);
          showToast('Custom hardware specifications applied!');
        }}
      />

      {/* Authentication & Profile Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        currentTheme={currentTheme}
        onSuccess={(user) => {
          showToast(`Welcome, ${user.gamerTag}!`);
          setIsAuthOpen(false);
        }}
      />

      {/* Footer */}
      <footer className="border-t border-white/[0.08] mt-16 py-6 bg-[#07090e]/95 text-xs text-slate-400 font-mono select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-white font-heading text-sm uppercase tracking-wide">WHAT CAN MY PC RUN?</span>
              <span className="text-slate-600">·</span>
              <span className="text-cyan-400 font-semibold">{activeThemeObj.name}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-500 text-[11px]">HARDWARE BENCHMARK PLATFORM</span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-4">
              <span className="hidden sm:inline">200+ CPUs • 140+ GPUs • Sub-Millisecond Physics</span>
              <span className="text-slate-600 hidden sm:inline">·</span>
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-black/60 border border-white/[0.15] font-mono text-[10px] text-cyan-300">T</kbd> for TV Mode</span>
            </div>
          </div>

          {/* Quick Footer Links */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/[0.05] text-[11px]">
            <button onClick={() => setCurrentStep('hero')} className="hover:text-cyan-400 transition-colors cursor-pointer">Home</button>
            <span className="text-slate-700">•</span>
            <button onClick={() => setCurrentStep('cpu')} className="hover:text-cyan-400 transition-colors cursor-pointer">PC Builder</button>
            <span className="text-slate-700">•</span>
            <button onClick={() => { setCurrentStep('results'); setActiveTab('games'); }} className="hover:text-cyan-400 transition-colors cursor-pointer">Benchmarks</button>
            <span className="text-slate-700">•</span>
            <button onClick={() => setCurrentStep('compare')} className="hover:text-cyan-400 transition-colors cursor-pointer">Games Library</button>
            <span className="text-slate-700">•</span>
            <button onClick={() => { setCurrentStep('results'); setActiveTab('target_fps'); }} className="hover:text-cyan-400 transition-colors cursor-pointer">Target FPS</button>
            <span className="text-slate-700">•</span>
            <button onClick={() => { setAuthMode('login'); setCurrentStep('auth'); }} className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer">Login & Sign Up Portal</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

