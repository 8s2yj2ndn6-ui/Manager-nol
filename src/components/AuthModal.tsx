import React, { useState } from 'react';
import { Shield, Lock, Mail, User as UserIcon, ArrowRight, Loader2, X, AlertCircle, CheckCircle2 } from 'lucide-react';
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
        }, 400);
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
        }, 400);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-[#0c1611]/95 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(16,185,129,0.15)] text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
            <Shield className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-['Big_Shoulders_Display'] text-2xl font-extrabold uppercase tracking-wide text-white">
              {mode === 'login' ? 'Manager Sign In' : 'Register Manager'}
            </h3>
            <p className="text-xs text-emerald-400/80 font-mono tracking-wider">
              OFFICIAL FOOTBALL SIMULATION SYSTEM
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 p-1 bg-black/40 rounded-xl border border-white/5 mb-6">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`py-2 text-xs uppercase font-bold tracking-wider rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`py-2 text-xs uppercase font-bold tracking-wider rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Feedback messages */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              {mode === 'login' ? 'Username or Email' : 'Manager Username'}
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={mode === 'login' ? 'e.g. gaffer99 or manager@nol.com' : 'e.g. AlexFerguson'}
                className="w-full pl-9 pr-3 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@domain.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold uppercase tracking-wider text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Manager License...</span>
              </>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In & Enter Game' : 'Confirm Registration'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>{mode === 'login' ? 'No manager account yet?' : 'Already have a license?'}</span>
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError(null);
            }}
            className="text-emerald-400 font-semibold hover:underline"
          >
            {mode === 'login' ? 'Create new account' : 'Sign in here'}
          </button>
        </div>
      </div>
    </div>
  );
};
