import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ArrowRight, 
  Loader2, 
  X, 
  AlertCircle, 
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import { api } from '../api.ts';
import { User, ClubItem, ServerItem } from '../types.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onAuthSuccess: (data: { user: User; activeClub: ClubItem | null; activeServer: ServerItem | null }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (mode === 'login') {
      if (!username.trim() || !password) {
        setError('Please enter your username/email and password.');
        return;
      }
    } else {
      if (!username.trim() || username.length < 3) {
        setError('Username must be at least 3 characters long.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      if (!password || password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await api.login(username.trim(), password);
        setSuccessMsg('Authentication confirmed. Welcome, Manager!');
        setTimeout(() => {
          onAuthSuccess({
            user: res.user,
            activeClub: res.activeClub,
            activeServer: res.activeServer,
          });
          onClose();
        }, 350);
      } else {
        const res = await api.register(username.trim(), email.trim(), password);
        setSuccessMsg('Account created successfully! Entering the league...');
        setTimeout(() => {
          onAuthSuccess({
            user: res.user,
            activeClub: null,
            activeServer: null,
          });
          onClose();
        }, 350);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div 
        className="relative w-full max-w-md liquid-glass-elevated rounded-3xl p-6 sm:p-8 border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.85)] text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Subtle Ambient Glow behind card */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-emerald-500/15 blur-[60px] rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/25 shrink-0">
            <Shield className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-['Big_Shoulders_Display'] text-2xl font-black uppercase tracking-wide text-white leading-none">
              {mode === 'login' ? 'Manager Sign In' : 'Create Manager License'}
            </h3>
            <div className="text-xs text-slate-400 font-mono mt-1">
              Official League Access Terminal
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 p-1 bg-black/50 rounded-xl border border-white/[0.08] mb-6">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`py-2 text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                : 'text-slate-400 hover:text-white font-medium'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`py-2 text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                : 'text-slate-400 hover:text-white font-medium'
            }`}
          >
            Register
          </button>
        </div>

        {/* Feedback messages */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
              {mode === 'login' ? 'Username or Email' : 'Manager Username'}
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={mode === 'login' ? 'e.g. gaffer99 or manager@nol.com' : 'e.g. AlexFerguson'}
                className="liquid-input w-full pl-10 pr-4 text-sm"
                required
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@domain.com"
                  className="liquid-input w-full pl-10 pr-4 text-sm"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="liquid-input w-full pl-10 pr-10 text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="liquid-input w-full pl-10 pr-4 text-sm"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="liquid-btn-primary w-full mt-2 py-3 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Manager License...</span>
              </>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In & Enter Game' : 'Confirm Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
          <span>{mode === 'login' ? 'No manager account yet?' : 'Already have a license?'}</span>
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError(null);
            }}
            className="text-emerald-400 font-semibold hover:underline cursor-pointer"
          >
            {mode === 'login' ? 'Create new account' : 'Sign in here'}
          </button>
        </div>
      </div>
    </div>
  );
};
