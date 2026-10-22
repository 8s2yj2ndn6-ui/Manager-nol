import React, { useState } from 'react';
import { 
  Shield, 
  Coins, 
  Server, 
  LogOut, 
  Building2, 
  Download, 
  Users, 
  Activity, 
  Share2,
  CheckCircle2,
  AlertTriangle,
  Award
} from 'lucide-react';
import { ClubItem, ServerItem, User, LineupConfig } from '../types.ts';
import { TacticalPitchCanvas } from './TacticalPitchCanvas.tsx';
import { LineupTab } from './LineupTab.tsx';
import { SquadTab } from './SquadTab.tsx';

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
  const [activeTab, setActiveTab] = useState<'tactics' | 'squad' | 'overview' | 'server'>('tactics');
  const [copiedLink, setCopiedLink] = useState(false);
  const [resignModalOpen, setResignModalOpen] = useState(false);
  const [resigning, setResigning] = useState(false);
  const [resignError, setResignError] = useState<string | null>(null);

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

  const handleUpdateLineup = async (lineup: LineupConfig) => {
    const res = await fetch('/api/clubs/lineup', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('manager_nol_token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lineup }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to update tactical lineup.');
    }
  };

  const handleConfirmResign = async () => {
    setResigning(true);
    setResignError(null);
    try {
      const res = await fetch('/api/clubs/resign', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('manager_nol_token')}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to resign from club.');
      }

      window.location.reload();
    } catch (err: any) {
      setResignError(err.message || 'Error executing contract resignation.');
      setResigning(false);
    }
  };

  const startingPlayerIds = new Set<string>(
    club.lineup?.startingPlayers ? club.lineup.startingPlayers.map(p => p.playerId) : []
  );

  return (
    <div className="relative min-h-screen bg-[#040806] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Ambient background lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="ambient-light-orb absolute -top-40 right-1/4 w-[700px] h-[700px] bg-emerald-600/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#123423_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />
      </div>

      {/* Top Header Bar: 3-Zone Contract */}
      <header className="relative z-30 liquid-glass sticky top-0 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Brand & Server Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/25 shrink-0">
              <Shield className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Big_Shoulders_Display'] text-2xl sm:text-3xl font-black uppercase text-white tracking-wider">
                  Manager Nol
                </span>
                <span className="font-mono text-xs font-bold text-emerald-400">
                  {server.code}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Official Club Operations Dashboard
              </div>
            </div>
          </div>

          {/* Zone 2: Manager & Club Context */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-300">
            <span className="text-slate-500">Club:</span>
            <span className="text-white font-bold">{club.name}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-500">Manager:</span>
            <span className="text-emerald-400 font-bold">@{user.username}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400 tabular-nums">22 Squad</span>
          </div>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={onOpenDownloadModal}
              className="liquid-btn-secondary text-xs py-2 px-3.5"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Export ZIP</span>
            </button>

            <button
              onClick={onChangeServer}
              className="hidden sm:inline-flex px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer items-center gap-1.5"
            >
              <Server className="w-3.5 h-3.5 text-slate-400" />
              <span>Servers</span>
            </button>

            <button
              onClick={() => setResignModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-xs text-rose-300 transition-colors cursor-pointer font-semibold"
            >
              Resign
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* Club Master Hero Card */}
        <div className="relative rounded-3xl liquid-glass-elevated p-6 sm:p-7 overflow-hidden border border-white/10">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Club Crest & Identity */}
            <div className="flex items-center gap-5">
              <div
                className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl flex items-center justify-center font-['Big_Shoulders_Display'] text-3xl sm:text-4xl font-black shadow-2xl border-2 shrink-0"
                style={{
                  backgroundColor: club.primaryColor,
                  color: club.secondaryColor === '#ffffff' ? '#ffffff' : '#f8fafc',
                  borderColor: club.accentColor,
                }}
              >
                {club.shortCode}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1 text-xs font-mono text-emerald-400 uppercase tracking-wider">
                  <span className="font-bold">Head Coach & Manager</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-300">Active Contract</span>
                </div>

                <h1 className="font-['Big_Shoulders_Display'] text-4xl sm:text-5xl font-black uppercase text-white tracking-tight leading-none">
                  {club.name}
                </h1>

                <p className="text-slate-400 text-xs sm:text-sm font-mono mt-1.5 flex items-center gap-3 flex-wrap">
                  <span>Manager: <strong className="text-white">@{user.username}</strong></span>
                  <span className="text-slate-600">·</span>
                  <span>Server: <strong className="text-emerald-400">{server.name} ({server.code})</strong></span>
                  <span className="text-slate-600">·</span>
                  <span>Est. {club.foundedYear}</span>
                </p>
              </div>
            </div>

            {/* Warchest & Actions */}
            <div className="flex flex-wrap items-center gap-4">
              {/* €100,000,000 Transfer Warchest */}
              <div className="px-5 py-3 rounded-2xl bg-black/60 border border-amber-500/30">
                <div className="text-[10px] font-mono uppercase text-amber-400 font-semibold flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5" />
                  <span>Transfer Warchest</span>
                </div>
                <div className="font-['Big_Shoulders_Display'] text-3xl sm:text-4xl font-black text-amber-300 tracking-tight leading-none mt-0.5 tabular-nums">
                  {formatCurrency(club.transferBudget)}
                </div>
              </div>

              <button
                onClick={handleShareManagerCard}
                className="liquid-btn-secondary text-xs py-3 px-4"
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

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 p-1.5 liquid-glass rounded-2xl border border-white/10 overflow-x-auto">
          {[
            { id: 'tactics', label: 'Tactics & Lineup', icon: Shield, badge: club.lineup?.formation || '4-4-2' },
            { id: 'squad', label: 'Squad Roster', icon: Users, badge: `${club.squad?.length || 22} Players` },
            { id: 'overview', label: 'Club Facilities & Stadium', icon: Building2, badge: club.stadiumName },
            { id: 'server', label: 'Server Universe', icon: Server, badge: `${server.code} · 30 Clubs` },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs uppercase font-extrabold tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950 stroke-[2.5]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span className={`text-[10px] font-mono font-bold ${
                  isActive ? 'text-slate-950' : 'text-slate-500'
                }`}>
                  ({tab.badge})
                </span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: TACTICS & LINEUP */}
        {activeTab === 'tactics' && (
          <LineupTab
            squad={club.squad}
            currentLineup={club.lineup}
            onUpdateLineup={handleUpdateLineup}
          />
        )}

        {/* TAB 2: SQUAD ROSTER (22 PLAYERS) */}
        {activeTab === 'squad' && (
          <SquadTab
            squad={club.squad}
            startingPlayerIds={startingPlayerIds}
          />
        )}

        {/* TAB 3: CLUB OVERVIEW & GROUND */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 4 Overview Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 rounded-2xl liquid-glass border border-amber-500/30">
                <div className="text-xs font-mono uppercase text-amber-400 font-semibold mb-1 flex items-center justify-between">
                  <span>Transfer Budget</span>
                  <Coins className="w-4 h-4" />
                </div>
                <div className="font-['Big_Shoulders_Display'] text-3xl font-black text-amber-300 tabular-nums">
                  {formatCurrency(club.transferBudget)}
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-2">
                  Guaranteed starting balance
                </div>
              </div>

              <div className="p-5 rounded-2xl liquid-glass border border-white/10">
                <div className="text-xs font-mono uppercase text-blue-400 font-semibold mb-1 flex items-center justify-between">
                  <span>Home Ground</span>
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="font-['Big_Shoulders_Display'] text-2xl font-black text-white truncate" title={club.stadiumName}>
                  {club.stadiumName}
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-2">
                  Capacity: <strong className="text-white tabular-nums">{club.stadiumCapacity.toLocaleString()}</strong> fans
                </div>
              </div>

              <div className="p-5 rounded-2xl liquid-glass border border-white/10">
                <div className="text-xs font-mono uppercase text-emerald-400 font-semibold mb-1 flex items-center justify-between">
                  <span>Squad Size</span>
                  <Users className="w-4 h-4" />
                </div>
                <div className="font-['Big_Shoulders_Display'] text-3xl font-black text-white tabular-nums">
                  22 Players
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-2">
                  Full 22-man professional roster
                </div>
              </div>

              <div className="p-5 rounded-2xl liquid-glass border border-white/10">
                <div className="text-xs font-mono uppercase text-purple-400 font-semibold mb-1 flex items-center justify-between">
                  <span>Contract Status</span>
                  <Award className="w-4 h-4" />
                </div>
                <div className="font-['Big_Shoulders_Display'] text-2xl font-black text-white">
                  Active
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-2">
                  Claimed: {club.claimedAt ? new Date(club.claimedAt).toLocaleDateString() : 'Today'}
                </div>
              </div>
            </div>

            {/* Pitch Simulation Ground */}
            <div className="rounded-3xl liquid-glass-elevated border border-white/10 overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-['Big_Shoulders_Display'] text-xl font-bold uppercase text-white">
                    Club Training Ground & Ball Physics Canvas
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                  Interactive simulation (Click pitch to strike ball)
                </span>
              </div>
              <div className="relative h-[420px] w-full bg-[#06170f]">
                <TacticalPitchCanvas className="w-full h-full cursor-crosshair" interactive={true} />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SERVER UNIVERSE */}
        {activeTab === 'server' && (
          <div className="rounded-3xl liquid-glass-elevated border border-white/10 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <h3 className="font-['Big_Shoulders_Display'] text-3xl font-black uppercase text-white">
                  Server {server.code} · {server.name}
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Region: {server.region} · Continent: {server.continent} · Base Latency: ~{server.basePing}ms
                </p>
              </div>

              <button
                onClick={onChangeServer}
                className="liquid-btn-primary text-xs"
              >
                Browse All 30 Servers
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl liquid-glass border border-white/5">
                <div className="text-xs font-mono uppercase text-slate-400">Total Clubs in Server</div>
                <div className="font-['Big_Shoulders_Display'] text-4xl font-black text-white mt-1 tabular-nums">
                  30 Clubs
                </div>
                <div className="text-[11px] font-mono text-emerald-400 mt-1">
                  1 claimed by you (@{user.username})
                </div>
              </div>

              <div className="p-5 rounded-2xl liquid-glass border border-white/5">
                <div className="text-xs font-mono uppercase text-slate-400">Global Server Architecture</div>
                <div className="font-['Big_Shoulders_Display'] text-4xl font-black text-white mt-1 tabular-nums">
                  30 Servers
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  900 total persistent clubs worldwide
                </div>
              </div>

              <div className="p-5 rounded-2xl liquid-glass border border-white/5">
                <div className="text-xs font-mono uppercase text-slate-400">Database Engine</div>
                <div className="font-['Big_Shoulders_Display'] text-4xl font-black text-white mt-1">
                  Active
                </div>
                <div className="text-[11px] font-mono text-emerald-400 mt-1">
                  Atomic JSON Persistence (data/database.json)
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Resignation Confirmation Modal */}
      {resignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-md liquid-glass-elevated border border-rose-500/40 rounded-3xl p-6 sm:p-7 shadow-[0_24px_64px_rgba(0,0,0,0.85)] text-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/60 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="font-['Big_Shoulders_Display'] text-2xl font-black uppercase text-white">
              Confirm Resignation
            </h3>

            <p className="text-xs font-mono text-slate-300 mt-2 leading-relaxed">
              Are you sure you want to resign as manager of <strong className="text-white">{club.name}</strong>?
            </p>

            <div className="mt-3 p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-slate-400 space-y-1">
              <div>· {club.name} will become open for other managers to claim.</div>
              <div>· Your manager account (@{user.username}) remains fully intact.</div>
              <div>· You will be able to claim any available club with a fresh €100,000,000 budget!</div>
            </div>

            {resignError && (
              <div className="mt-3 p-3 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs">
                {resignError}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={resigning}
                onClick={() => setResignModalOpen(false)}
                className="liquid-btn-secondary text-xs uppercase"
              >
                Keep Contract
              </button>

              <button
                type="button"
                disabled={resigning}
                onClick={handleConfirmResign}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-wider transition-colors shadow-lg shadow-rose-600/30 cursor-pointer disabled:opacity-50"
              >
                {resigning ? 'Resigning...' : 'Confirm Resignation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
