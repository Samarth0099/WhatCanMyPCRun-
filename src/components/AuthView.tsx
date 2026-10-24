import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Cpu, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Flame, 
  Check, 
  X, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { authService, GamerUser, DEFAULT_DEMO_USER } from '../services/authService';
import { ThemeId, THEMES } from '../types/theme';
import { ScrollReveal } from './ScrollReveal';

export type AuthMode = 'login' | 'signup' | 'forgot';

interface AuthViewProps {
  initialMode?: AuthMode;
  currentTheme?: ThemeId;
  onSuccess?: (user: GamerUser) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'login',
  currentTheme = 'cyberpunk',
  onSuccess,
  onClose,
  isModal = false,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(true);

  // UI status
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const themeObj = THEMES[currentTheme] || THEMES.cyberpunk;

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Empty', color: 'bg-slate-700' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-cyan-400' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-400' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (mode === 'login') {
      if (!email.trim() || !password) {
        setErrorMessage('Please enter both your email address and password.');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const user = authService.login(email.trim(), password);
        setSuccessMessage(`Welcome back, ${user.name}! Accessing command center...`);
        setTimeout(() => {
          if (onSuccess) onSuccess(user);
          if (onClose) onClose();
        }, 800);
      }, 600);
    } else if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name or gamer tag.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please verify.');
        return;
      }
      if (!acceptTerms) {
        setErrorMessage('Please accept the Terms of Service & Privacy Policy to proceed.');
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const user = authService.register(fullName.trim(), email.trim(), password);
        setSuccessMessage(`Account activated! Welcome to the squad, ${user.gamerTag}.`);
        setTimeout(() => {
          if (onSuccess) onSuccess(user);
          if (onClose) onClose();
        }, 900);
      }, 700);
    } else if (mode === 'forgot') {
      if (!email.trim() || !email.includes('@')) {
        setErrorMessage('Please enter a valid email address for recovery.');
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setSuccessMessage(`Recovery link transmitted to ${email}. Check your inbox.`);
      }, 600);
    }
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const user = authService.loginWithGoogle();
      setSuccessMessage(`Google authentication verified. Welcome, ${user.name}!`);
      setTimeout(() => {
        if (onSuccess) onSuccess(user);
        if (onClose) onClose();
      }, 800);
    }, 600);
  };

  const handleDemoAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const user = authService.loginDemo();
      setSuccessMessage(`Demo Gamer Profile loaded (${user.gamerTag})!`);
      setTimeout(() => {
        if (onSuccess) onSuccess(user);
        if (onClose) onClose();
      }, 600);
    }, 400);
  };

  return (
    <div className={`w-full ${isModal ? 'p-0' : 'min-h-[calc(100vh-64px)] py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center'}`}>
      <div className="w-full max-w-5xl mx-auto rounded-2xl border border-white/[0.08] bg-[#0c101a]/95 backdrop-blur-xl shadow-2xl shadow-cyan-950/20 overflow-hidden relative">
        {/* Subtle Ambient Glows */}
        <div 
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-25"
          style={{ backgroundColor: themeObj.primaryHex }}
        />
        <div 
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-20"
          style={{ backgroundColor: themeObj.secondaryHex }}
        />

        {/* Top bar with close option */}
        {onClose && (
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-slate-400 hover:text-white border border-white/[0.08] transition-all cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
          
          {/* ================= LEFT SECTION: BRANDING & VISUALS ================= */}
          <ScrollReveal variant="fade" className="md:col-span-5 flex flex-col">
            <div className="p-5 sm:p-8 md:p-6 lg:p-10 border-b md:border-b-0 md:border-r border-white/[0.08] bg-gradient-to-b from-[#101626]/80 to-[#0a0e18]/90 flex flex-col justify-between relative overflow-hidden h-full">
              {/* Subtle Circuit Grid Texture */}
              <div className="absolute inset-0 bg-[radial-gradient(#283548_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

              {/* Top Brand Logo */}
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border border-white/20"
                    style={{ background: `linear-gradient(135deg, ${themeObj.primaryHex}, ${themeObj.secondaryHex})` }}
                  >
                    <Cpu className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="font-black text-base tracking-wider text-white flex items-center gap-1.5">
                      RIGLAB
                      <span 
                        className="text-[10px] font-mono px-1.5 py-0.2 rounded border uppercase font-bold"
                        style={{ color: themeObj.primaryHex, borderColor: `${themeObj.primaryHex}40` }}
                      >
                        PRO
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono tracking-wide">
                      FPS ESTIMATOR & HARDWARE LAB
                    </div>
                  </div>
                </div>

                {/* Dynamic Headings based on mode */}
                <div className="space-y-2 mb-6">
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                    {mode === 'login' && (
                      <>
                        Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">Gamer.</span>
                      </>
                    )}
                    {mode === 'signup' && (
                      <>
                        Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">Battle Station.</span>
                      </>
                    )}
                    {mode === 'forgot' && (
                      <>
                        Account <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">Recovery.</span>
                      </>
                    )}
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Manage your custom PC builds, benchmark graphics presets across 100+ titles, and simulate bottleneck-free framerates before spending a dollar.
                  </p>
                </div>

                {/* 3D Hardware Spec Badge Graphic */}
                <div className="p-4 rounded-xl border border-white/[0.08] bg-[#141b2a]/70 backdrop-blur-sm relative group overflow-hidden mb-6">
                  <div 
                    className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none"
                    style={{ backgroundColor: themeObj.primaryHex }}
                  />
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                      <Zap className="w-3 h-3 text-cyan-400" /> RIG ARCHITECT WORKSPACE
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      SECURE
                    </span>
                  </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-[#0b0f19] p-2 rounded-lg border border-white/[0.05]">
                    <div className="text-[10px] text-slate-500">MAX RASTER PRESET</div>
                    <div className="text-white font-bold flex items-center gap-1 mt-0.5">
                      <Flame className="w-3 h-3 text-amber-400" /> 144+ FPS ULTRA
                    </div>
                  </div>
                  <div className="bg-[#0b0f19] p-2 rounded-lg border border-white/[0.05]">
                    <div className="text-[10px] text-slate-500">BOTTLENECK INDEX</div>
                    <div className="text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3 h-3" /> 2.1% OPTIMAL
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="relative z-10 space-y-2.5 pt-4 border-t border-white/[0.08]">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-white">Saved PC Builds:</span> Cloud sync your custom parts & upgrade paths.
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300">
                <div className="w-6 h-6 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-white">Side-by-Side Arena:</span> Direct head-to-head component benchmarks.
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-white">Telemetry & Target FPS:</span> 1% low accuracy verified on modern engines.
                </div>
              </div>
            </div>

            {/* Bottom quick demo login trigger */}
            <div className="mt-6 pt-4 border-t border-white/[0.08] relative z-10">
              <button
                type="button"
                onClick={handleDemoAuth}
                className="w-full py-2 px-3 rounded-xl border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.07] text-slate-300 text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>⚡ Instant One-Click Demo Gamer Login</span>
                <ArrowRight className="w-3 h-3 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* ================= RIGHT SECTION: AUTH CARD ================= */}
        <ScrollReveal variant="slide-up" delayMs={80} className="md:col-span-7 lg:col-span-7 flex flex-col justify-center">
          <div className="p-5 sm:p-8 md:p-6 lg:p-10 flex flex-col justify-center relative">
            <div className="w-full max-w-md mx-auto">
              
              {/* Mode Switcher Tabs */}
              <div className="flex items-center p-1 rounded-xl bg-[#090d17] border border-white/[0.08] mb-6">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMessage(null); }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-white border border-cyan-400/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setErrorMessage(null); }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-white border border-cyan-400/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setErrorMessage(null); }}
                  className={`py-2 px-3 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    mode === 'forgot'
                      ? 'bg-white/[0.08] text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Recovery
                </button>
              </div>

              {/* Status Notifications */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <X className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* FORM CONTAINER */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name field (Only in Sign Up) */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      FULL NAME / GAMER TAG
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Alex Mercer / CyberViper"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.08] bg-[#0c101a] text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40 transition-all font-sans"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Email Address field */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    EMAIL ADDRESS
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="gamer@domain.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.08] bg-[#0c101a] text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40 transition-all font-sans"
                      required
                    />
                  </div>
                </div>

                {/* Password field (Login & Signup) */}
                {mode !== 'forgot' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-mono text-slate-300">
                        PASSWORD
                      </label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => setMode('forgot')}
                          className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-white/[0.08] bg-[#0c101a] text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40 transition-all font-sans"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Meter (Signup mode) */}
                    {mode === 'signup' && password.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span>STRENGTH:</span>
                          <span className={strength.score >= 75 ? 'text-emerald-400' : 'text-amber-400'}>
                            {strength.label}
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${strength.color}`}
                            style={{ width: `${strength.score}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Confirm Password field (Sign Up mode) */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      CONFIRM PASSWORD
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-white/[0.08] bg-[#0c101a] text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40 transition-all font-sans"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Checkboxes: Remember Me (Login) OR Terms (Signup) */}
                {mode === 'login' && (
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded bg-[#090d16] border-white/20 text-cyan-400 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      />
                      <span>Remember this battle station</span>
                    </label>
                  </div>
                )}

                {mode === 'signup' && (
                  <div className="pt-1">
                    <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-400 select-none">
                      <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="w-4 h-4 rounded bg-[#090d16] border-white/20 text-cyan-400 focus:ring-0 focus:ring-offset-0 cursor-pointer mt-0.5"
                      />
                      <span className="leading-snug">
                        I agree to the <span className="text-cyan-400 underline">Terms of Service</span> and <span className="text-cyan-400 underline">Privacy Policy</span>.
                      </span>
                    </label>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl font-bold text-sm tracking-wide text-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-cyan-400/25 disabled:opacity-50 mt-2"
                  style={{
                    background: `linear-gradient(135deg, ${themeObj.primaryHex}, #67e8f9)`,
                  }}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        {mode === 'login' && 'Sign In to Rig Lab'}
                        {mode === 'signup' && 'Create Gamer Account'}
                        {mode === 'forgot' && 'Send Recovery Instructions'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* SOCIAL / GOOGLE SIGN IN DIVIDER */}
              {mode !== 'forgot' && (
                <>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/[0.08]" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-[#0c101a] px-3 font-mono text-[10px] text-slate-500 tracking-wider">
                        OR CONTINUE WITH
                      </span>
                    </div>
                  </div>

                  {/* Google Sign In Button */}
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl border border-white/[0.1] bg-[#121724] hover:bg-[#181f30] text-slate-200 text-xs font-semibold flex items-center justify-center gap-3 transition-all cursor-pointer group"
                  >
                    {/* Official Google 'G' icon */}
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </>
              )}

              {/* Bottom Mode Switch Link */}
              <div className="mt-6 text-center text-xs text-slate-400">
                {mode === 'login' && (
                  <p>
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => { setMode('signup'); setErrorMessage(null); }}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer underline ml-1"
                    >
                      Create one now
                    </button>
                  </p>
                )}
                {mode === 'signup' && (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setMode('login'); setErrorMessage(null); }}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer underline ml-1"
                    >
                      Sign in here
                    </button>
                  </p>
                )}
                {mode === 'forgot' && (
                  <p>
                    Remembered your password?{' '}
                    <button
                      type="button"
                      onClick={() => { setMode('login'); setErrorMessage(null); }}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer underline ml-1"
                    >
                      Return to sign in
                    </button>
                  </p>
                )}
              </div>

            </div>
          </div>
        </ScrollReveal>

        </div>
      </div>
    </div>
  );
};
