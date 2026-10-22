import React, { useState } from 'react';
import { 
  Shield, 
  Coins, 
  Server, 
  User as UserIcon, 
  LogOut, 
  Building2, 
  Download, 
  Calendar, 
  Users, 
  Sparkles, 
  Activity, 
  ArrowRight,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { ClubItem, ServerItem, User } from '../types.ts';
import { TacticalPitchCanvas } from './TacticalPitchCanvas.tsx';
import { LineupTab } from './LineupTab.tsx';

interface ManagerDashboardProps {
  user: User;
  club: ClubItem;
  server: ServerItem;
  onLogout: () => void;
  onChangeServer: () => void;
  onOpenDownloadModal: () => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  user,
  club,
  server,
  onLogout,
  onChangeServer,
  onOpenDownloadModal,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleShareManagerCard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Manager @${user.username} is leading ${club.name} on server ${server.code} with a warchest of €100,000,000 in Manager Nol!`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#070c09] text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#09140e]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Server Tag */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20">
              <Shield className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Big_Shoulders_Display'] text-2xl font-black uppercase text-white tracking-wider">
                  Manager Nol
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-[10px] font-mono text-emerald-400 font-bold">
                  {server.code}
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                Official Club Operations Dashboard
              </div>
            </div>
          </div>

          {/* Manager Profile & Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenDownloadModal}
              title="Download project ZIP for Bolt.new"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export ZIP</span>
            </button>

            <button
              onClick={onChangeServer}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/80 border border-emerald-500/30 text-xs text-emerald-300 transition-colors cursor-pointer"
            >
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Change Server</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-xs text-red-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Manager Welcome & Verification Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0d2218] via-[#09150f] to-[#0d2218] border border-emerald-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Club Crest */}
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center font-['Big_Shoulders_Display'] text-3xl sm:text-4xl font-black shadow-2xl border-2 shrink-0"
                style={{
                  backgroundColor: club.primaryColor,
                  color: club.secondaryColor === '#ffffff' ? '#ffffff' : '#f8fafc',
                  borderColor: club.accentColor,
                }}
              >
                {club.shortCode}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider">
                    HEAD COACH & MANAGER
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    Verified Active Contract
                  </span>
                </div>

                <h1 className="font-['Big_Shoulders_Display'] text-4xl sm:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight leading-none">
                  {club.name}
                </h1>

                <p className="text-slate-300 text-xs sm:text-sm font-mono mt-1.5 flex items-center gap-3 flex-wrap">
                  <span>Manager: <strong className="text-white">@{user.username}</strong></span>
                  <span className="text-slate-600">•</span>
                  <span>Server: <strong className="text-emerald-400">{server.name} ({server.code})</strong></span>
                  <span className="text-slate-600">•</span>
                  <span>Est. {club.foundedYear}</span>
                </p>
              </div>
            </div>

            {/* Quick Share / Export Badge */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleShareManagerCard}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-2 transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Credentials Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-slate-400" />
                    <span>Share License</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 4 Core Financial & Management Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: STRICT €100,000,000 Transfer Budget */}
          <div className="p-6 rounded-2xl bg-[#09150f] border border-amber-500/30 bg-gradient-to-b from-amber-950/20 to-transparent relative overflow-hidden group">
            <div className="flex items-center justify-between text-amber-400 mb-3">
              <span className="text-xs font-mono uppercase font-semibold tracking-wider">
                Current Transfer Warchest
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Coins className="w-4 h-4 text-amber-400" />
              </div>
            </div>

            <div className="font-['Big_Shoulders_Display'] text-4xl font-black text-amber-300 tracking-tight">
              {formatCurrency(club.transferBudget)}
            </div>

            <div className="mt-3 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Strict Rule: Exact €100,000,000 initialized</span>
            </div>
          </div>

          {/* Card 2: Server World Status */}
          <div className="p-6 rounded-2xl bg-[#09150f] border border-white/10 relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-mono uppercase font-semibold tracking-wider">
                World & League
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Server className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            <div className="font-['Big_Shoulders_Display'] text-3xl font-extrabold text-white tracking-tight">
              {server.code} • {server.continent}
            </div>

            <div className="mt-3 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{server.region} (~{server.basePing}ms)</span>
            </div>
          </div>

          {/* Card 3: Stadium & Facilities */}
          <div className="p-6 rounded-2xl bg-[#09150f] border border-white/10 relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-mono uppercase font-semibold tracking-wider">
                Home Stadium
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-blue-400" />
              </div>
            </div>

            <div className="font-['Big_Shoulders_Display'] text-2xl font-extrabold text-white tracking-tight truncate" title={club.stadiumName}>
              {club.stadiumName}
            </div>

            <div className="mt-3 text-[11px] font-mono text-slate-400">
              Capacity: <strong className="text-white">{club.stadiumCapacity.toLocaleString()}</strong> seats
            </div>
          </div>

          {/* Card 4: Manager Status */}
          <div className="p-6 rounded-2xl bg-[#09150f] border border-white/10 relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-mono uppercase font-semibold tracking-wider">
                Manager Identity
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-purple-400" />
              </div>
            </div>

            <div className="font-['Big_Shoulders_Display'] text-3xl font-extrabold text-white tracking-tight">
              @{user.username}
            </div>

            <div className="mt-3 text-[11px] font-mono text-slate-400">
              Contract Signed: {club.claimedAt ? new Date(club.claimedAt).toLocaleDateString() : 'Active'}
            </div>
            
            <button
                onClick={async () => {
                    if(confirm('Are you sure you want to resign from ' + club.name + '? You will have to claim a new club.')) {
                        await fetch('/api/clubs/resign', { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('manager_nol_token')}` } });
                        window.location.reload();
                    }
                }}
                className="mt-4 w-full py-2 bg-red-900/50 hover:bg-red-800/60 text-red-200 text-xs font-bold uppercase rounded-lg transition-colors"
            >
                Resign
            </button>
          </div>
        </div>
        
        {/* Lineup Tab */}
        <div className="bg-[#09150f] border border-white/10 rounded-2xl p-6">
            <LineupTab squad={club.squad} currentLineup={club.lineup} onUpdateLineup={async(l) => {
                await fetch('/api/clubs/lineup', { 
                    method: 'POST', 
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('manager_nol_token')}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lineup: l })
                });
                window.location.reload();
            }} />
        </div>

        {/* Tactical Pitch Radar & Club Operations Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tactical Pitch Visualizer */}
          <div className="lg:col-span-8 bg-[#09150f] rounded-2xl border border-white/10 overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-[#0a1811]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="font-['Big_Shoulders_Display'] text-xl font-bold uppercase text-white">
                  Tactical Training Pitch & Simulation
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Interactive Ground (Click pitch to strike)
              </span>
            </div>

            <div className="relative h-[380px] w-full">
              <TacticalPitchCanvas className="w-full h-full cursor-crosshair" interactive={true} />
            </div>
          </div>

          {/* Future Modules Ready Notice */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 rounded-2xl bg-[#09150f] border border-emerald-500/20 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950 border border-emerald-500/30 text-[10px] font-mono uppercase text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next Update Ready</span>
              </div>

              <h4 className="font-['Big_Shoulders_Display'] text-2xl font-bold uppercase text-white leading-tight">
                Transfer Market & Squad Tactics
              </h4>

              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                Your club is officially initialized with your <strong>€100,000,000</strong> warchest on server <strong>{server.code}</strong>.
                Per project brief, player transfers, tactics, match schedules, and league tables are left ready for the next iteration.
              </p>

              <div className="pt-2 border-t border-white/5 space-y-2">
                <button
                  onClick={onOpenDownloadModal}
                  className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase text-xs tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Project ZIP (Bolt.new)</span>
                </button>

                <button
                  onClick={onChangeServer}
                  className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold uppercase text-xs tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Server className="w-4 h-4 text-emerald-400" />
                  <span>Explore Other 29 Servers</span>
                </button>
              </div>
            </div>

            {/* Persistence Guarantee Callout */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs font-mono text-slate-400 space-y-1">
              <div className="text-slate-300 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Database Persistence Active
              </div>
              <p className="text-[11px] leading-relaxed">
                Your manager assignment, server location, and exact €100,000,000 budget are saved in <code>data/database.json</code> and will automatically restore when you log in again.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
