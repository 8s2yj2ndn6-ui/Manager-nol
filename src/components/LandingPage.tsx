import React, { useState } from 'react';
import { 
  Shield, 
  Download, 
  ChevronRight, 
  SlidersHorizontal,
  Compass,
  Zap,
  Layers,
  Sparkles
} from 'lucide-react';
import { TacticalPitchCanvas } from './TacticalPitchCanvas.tsx';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenDownloadModal: () => void;
  serverCount?: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onOpenDownloadModal,
  serverCount = 30,
}) => {
  const [pitchIntensity, setPitchIntensity] = useState<'full' | 'ambient'>('full');

  return (
    <div className="relative min-h-screen bg-[#040806] text-slate-100 flex flex-col overflow-x-hidden selection:bg-emerald-500 selection:text-black">
      {/* Cinematic Animated Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="ambient-light-orb absolute -top-40 left-1/3 w-[650px] h-[650px] bg-gradient-to-br from-emerald-600/18 via-emerald-800/10 to-transparent blur-[140px] rounded-full" />
        <div className="ambient-light-orb-delayed absolute top-1/2 -right-28 w-[500px] h-[500px] bg-gradient-to-tl from-emerald-500/12 via-teal-900/10 to-transparent blur-[130px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[350px] bg-emerald-950/20 blur-[100px] rounded-full" />
        {/* Subtle pitch grid lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#123423_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
      </div>

      {/* Top Navigation Bar: Strict 3-zone contract */}
      <header className="relative z-30 liquid-glass sticky top-0 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element Brand Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/25">
              <Shield className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="font-['Big_Shoulders_Display'] text-3xl font-black uppercase tracking-wider text-white whitespace-nowrap">
              Manager Nol
            </span>
          </div>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#tactics" className="hover:text-emerald-400 transition-colors whitespace-nowrap">
              Tactical Engine
            </a>
            <a href="#servers" className="hover:text-emerald-400 transition-colors whitespace-nowrap">
              30 Dedicated Servers
            </a>
            <a href="#warchest" className="hover:text-emerald-400 transition-colors whitespace-nowrap">
              €100M Warchest
            </a>
            <a href="#formations" className="hover:text-emerald-400 transition-colors whitespace-nowrap">
              15 Formations
            </a>
          </nav>

          {/* Zone 3: Primary Action Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenDownloadModal}
              className="hidden sm:inline-flex liquid-btn-secondary"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export ZIP</span>
            </button>

            <button
              onClick={() => onOpenAuth('login')}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Sign In
            </button>

            <button
              onClick={() => onOpenAuth('register')}
              className="liquid-btn-primary"
            >
              <span>Enter League</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 pb-20 lg:pt-20 lg:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Typography */}
          <div className="lg:col-span-6 space-y-7 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-mono tracking-wider text-emerald-400 uppercase">
              <span>Dynamic Tactical Simulation</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="tabular-nums">{serverCount} Live Servers</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Multi-User Roster</span>
            </div>

            <h1 className="font-['Big_Shoulders_Display'] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-[0.92] text-balance">
              TACTICAL SUPREMACY. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                PRO FOOTBALL OWNERSHIP.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl font-normal leading-relaxed text-balance">
              Take the managerial hot seat across 30 persistent servers with 900 unique clubs. 
              Deploy master formations, command unified squad effort, and lead your 22-man roster to European glory.
            </p>

            {/* Metrics Strip */}
            <div className="grid grid-cols-3 gap-4 pt-2 max-w-lg mx-auto lg:mx-0">
              <div className="liquid-glass rounded-2xl p-4 text-center lg:text-left">
                <div className="font-['Big_Shoulders_Display'] text-4xl font-extrabold text-white tabular-nums leading-none">
                  30
                </div>
                <div className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">
                  Live Servers
                </div>
              </div>

              <div className="liquid-glass rounded-2xl p-4 text-center lg:text-left">
                <div className="font-['Big_Shoulders_Display'] text-4xl font-extrabold text-emerald-400 tabular-nums leading-none">
                  900
                </div>
                <div className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">
                  Unique Clubs
                </div>
              </div>

              <div className="liquid-glass rounded-2xl p-4 text-center lg:text-left">
                <div className="font-['Big_Shoulders_Display'] text-4xl font-extrabold text-amber-300 tabular-nums leading-none">
                  €100M
                </div>
                <div className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">
                  Club Warchest
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => onOpenAuth('register')}
                className="liquid-btn-primary w-full sm:w-auto text-base px-7 py-3.5"
              >
                <span>Claim Your Club</span>
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => onOpenAuth('login')}
                className="liquid-btn-secondary w-full sm:w-auto text-sm px-6 py-3.5"
              >
                <span>Returning Manager Login</span>
              </button>
            </div>
          </div>

          {/* Hero Right: Cinematic Interactive Tactical Board */}
          <div className="lg:col-span-6 relative">
            <div className="liquid-glass-elevated rounded-3xl p-5 sm:p-6 border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.8)]">
              {/* Board Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-['Big_Shoulders_Display'] text-2xl font-bold uppercase text-white leading-none">
                      Matchday Tactical Pitch
                    </h2>
                    <div className="text-xs font-mono text-slate-400">
                      Live Ball Physics & Position Movement
                    </div>
                  </div>
                </div>

                {/* Intensity Toggle */}
                <div className="flex items-center gap-1 p-1 bg-black/50 border border-white/10 rounded-lg">
                  <button
                    onClick={() => setPitchIntensity('full')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      pitchIntensity === 'full' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Match Pace
                  </button>
                  <button
                    onClick={() => setPitchIntensity('ambient')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      pitchIntensity === 'ambient' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Drill Pace
                  </button>
                </div>
              </div>

              {/* Pitch Canvas Container */}
              <div className="relative rounded-2xl overflow-hidden border border-emerald-500/20 h-[380px] sm:h-[420px] bg-[#07170e]">
                <TacticalPitchCanvas intensity={pitchIntensity} interactive={true} />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none text-xs font-mono text-emerald-300/80 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                  <span>Formation 4-3-3 Attack</span>
                  <span className="tabular-nums">64% Possession</span>
                  <span>Effort: High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tactical Pillars Section */}
      <section id="tactics" className="relative z-10 py-16 border-t border-white/[0.08] bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">
              Deep Strategic Engineering
            </div>
            <h2 className="font-['Big_Shoulders_Display'] text-4xl sm:text-5xl font-black uppercase text-white">
              Built for Modern Football Thinkers
            </h2>
            <p className="text-slate-400 text-sm mt-3 text-balance">
              Every detail is calibrated to mirror realistic club dynamics — from player stamina wear to authentic tactical formations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="liquid-glass-card rounded-2xl p-6 sm:p-7 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h3 className="font-['Big_Shoulders_Display'] text-2xl font-bold uppercase text-white">
                Team-Wide Effort System
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                One unified selector governs your squad's work rate: <strong className="text-white">Medium</strong>, <strong className="text-white">High</strong>, or <strong className="text-white">Extreme</strong>. 
                Experience realistic stamina depletion (~14%, ~22%, ~32%) matching physical pressing intensity.
              </p>
              <div className="text-xs font-mono text-slate-400 pt-2 border-t border-white/5 flex items-center justify-between">
                <span>Stamina Consumption</span>
                <span className="text-emerald-400 font-bold tabular-nums">14% · 22% · 32%</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div id="formations" className="liquid-glass-card rounded-2xl p-6 sm:p-7 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-['Big_Shoulders_Display'] text-2xl font-bold uppercase text-white">
                15 Tactical Formations
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Choose from 15 master shapes including 4-4-2, 4-3-3, 4-2-3-1, 3-5-2, 4-2-2-2, and 5-4-1. 
                Preview coordinates instantly on the tactical mini-pitch and swap starters seamlessly from your 11 bench reserves.
              </p>
              <div className="text-xs font-mono text-slate-400 pt-2 border-t border-white/5 flex items-center justify-between">
                <span>Tactical Layouts</span>
                <span className="text-emerald-400 font-bold tabular-nums">15 Formations</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div id="servers" className="liquid-glass-card rounded-2xl p-6 sm:p-7 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-['Big_Shoulders_Display'] text-2xl font-bold uppercase text-white">
                30 Persistent Servers
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Compete across European, American, Asian, and International clusters. 
                Each server hosts exactly 30 unique football clubs initialized with an identical €100,000,000 transfer warchest.
              </p>
              <div className="text-xs font-mono text-slate-400 pt-2 border-t border-white/5 flex items-center justify-between">
                <span>Total Active Clubs</span>
                <span className="text-emerald-400 font-bold tabular-nums">900 Managed Clubs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 border-t border-white/[0.08] bg-[#020503]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-bold text-white">MANAGER NOL</span>
            <span>·</span>
            <span>Tactical Football Simulation</span>
            <span>·</span>
            <span className="tabular-nums">2026 Season</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={onOpenDownloadModal}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Export Project ZIP
            </button>
            <button
              onClick={() => onOpenAuth('login')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold cursor-pointer"
            >
              Register
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
