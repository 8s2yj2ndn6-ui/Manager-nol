import React, { useState } from 'react';
import { 
  Shield, 
  Globe2, 
  Coins, 
  Play, 
  Download, 
  Layers, 
  Award, 
  ChevronRight, 
  Flame, 
  Sparkles,
  Server,
  Zap
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
  const [pitchMode, setPitchMode] = useState<'standard' | 'focused'>('standard');

  return (
    <div className="relative min-h-screen bg-[#070c09] text-slate-100 flex flex-col overflow-x-hidden">
      {/* Background Subtle Gradient & Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-emerald-600/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[450px] bg-emerald-950/20 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#153223_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      {/* Top Navigation */}
      <header className="relative z-20 border-b border-white/5 bg-[#08100c]/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/25">
              <Shield className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-['Big_Shoulders_Display'] text-3xl font-extrabold uppercase tracking-wider text-white">
                Manager Nol
              </span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                  {serverCount} Servers Online
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onOpenDownloadModal}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export ZIP for Bolt.new</span>
            </button>

            <button
              onClick={() => onOpenAuth('login')}
              className="px-4 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider text-slate-200 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Sign In
            </button>

            <button
              onClick={() => onOpenAuth('register')}
              className="px-5 py-2.5 rounded-xl text-xs uppercase font-extrabold tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer group"
            >
              <span>Play Now</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-10 pb-16 lg:pt-16 lg:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE MODERN TACTICAL FOOTBALL SIMULATION</span>
            </div>

            <h1 className="font-['Big_Shoulders_Display'] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-[0.92]">
              TAKE THE REINS. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-300">
                OWN YOUR DYNASTY.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
              Step into high-stakes football club management across <strong className="text-white font-semibold">30 dedicated servers</strong>. 
              Claim your seat at the helm of <strong className="text-white font-semibold">900 unique clubs</strong> with an instant 
              <strong className="text-emerald-400 font-semibold"> €100,000,000 transfer warchest</strong>.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 py-2 max-w-xl mx-auto lg:mx-0">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-extrabold font-['Big_Shoulders_Display'] text-emerald-400">
                  30
                </div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Live Servers
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-extrabold font-['Big_Shoulders_Display'] text-white">
                  900
                </div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Unique Clubs
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-extrabold font-['Big_Shoulders_Display'] text-amber-400">
                  €100M
                </div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Club Warchest
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-extrabold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-[0_0_30px_rgba(16,185,129,0.35)] flex items-center justify-center gap-3 cursor-pointer group"
              >
                <Play className="w-5 h-5 fill-slate-950 stroke-none" />
                <span>Create Manager License</span>
              </button>

              <button
                onClick={() => onOpenAuth('login')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider bg-[#101e16] hover:bg-[#162a1f] border border-emerald-500/30 text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Existing Manager Sign In</span>
              </button>
            </div>
          </div>

          {/* Hero Right - Interactive Tactical Pitch Preview */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl p-1 bg-gradient-to-b from-emerald-500/30 via-white/5 to-transparent shadow-2xl">
              <div className="relative bg-[#09140e] rounded-[22px] overflow-hidden border border-emerald-500/20 shadow-inner">
                {/* Tactical Bezel Top */}
                <div className="px-4 py-3 bg-[#0a1811] border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-mono uppercase font-semibold text-emerald-400 tracking-wider">
                      Live Tactical Radar
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Click pitch to strike
                  </span>
                </div>

                {/* Pitch Canvas Container */}
                <div className="relative h-[360px] sm:h-[420px] w-full">
                  <TacticalPitchCanvas className="w-full h-full cursor-crosshair" interactive={true} />
                  
                  {/* Subtle Tactical Overlay HUD */}
                  <div className="absolute bottom-3 left-3 right-3 pointer-events-none flex items-center justify-between bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-[11px] font-mono text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Formation: 4-3-3 Attack
                    </span>
                    <span className="text-amber-400 font-semibold">Strict €100M Cap</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Grid */}
      <section className="relative z-10 py-16 bg-[#060c08] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-['Big_Shoulders_Display'] text-4xl sm:text-5xl font-extrabold uppercase text-white tracking-wide">
              Architected For True Football Enthusiasts
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Every server operates as an autonomous competitive realm with persistent club ownership and verified budgets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-[#09150f] border border-white/5 hover:border-emerald-500/40 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="font-['Big_Shoulders_Display'] text-2xl font-bold uppercase text-white mb-2">
                30 Dedicated Servers
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Connect to servers ranging from EU01 (Europe Central) to ENG02, ESP04, BRA09, and WLD30 with distinct leagues and low ping.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-[#09150f] border border-white/5 hover:border-emerald-500/40 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-['Big_Shoulders_Display'] text-2xl font-bold uppercase text-white mb-2">
                900 Unique Clubs
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Original realistic AI-crafted institutions like <em>Northbridge FC</em>, <em>Royal Vesterholm</em>, and <em>Ironvale Athletic</em> with full histories.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-[#09150f] border border-white/5 hover:border-emerald-500/40 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="font-['Big_Shoulders_Display'] text-2xl font-bold uppercase text-white mb-2">
                Strict €100,000,000 Budget
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Every newly claimed club is assigned an exact €100M warchest directly on the backend database. Never reset on refresh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Export to Bolt.new Banner */}
      <section className="relative z-10 py-12 bg-gradient-to-r from-emerald-950/40 via-[#0a1811] to-emerald-950/40 border-t border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs font-mono uppercase text-emerald-400 font-semibold tracking-wider">
              DEVELOPER & CREATOR READY
            </span>
            <h3 className="font-['Big_Shoulders_Display'] text-3xl font-extrabold uppercase text-white">
              Download Complete Project ZIP for Bolt.new
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              Includes full source code, package.json, Express server, and 30-server seed data.
            </p>
          </div>

          <button
            onClick={onOpenDownloadModal}
            className="px-6 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-white font-bold text-xs uppercase tracking-wider flex items-center gap-3 transition-colors cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download Project ZIP</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-auto py-8 bg-[#040806] border-t border-white/5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="font-['Big_Shoulders_Display'] text-lg font-bold text-slate-300 uppercase tracking-wide">
              Manager Nol
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-[11px] font-mono">v1.0.0 Production</span>
          </div>
          <p className="text-[11px] font-mono text-slate-500">
            30 Dedicated Servers • 900 Clubs • €100,000,000 Warchest Initialized
          </p>
        </div>
      </footer>
    </div>
  );
};
