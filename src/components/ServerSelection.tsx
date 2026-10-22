import React, { useState } from 'react';
import { 
  Wifi, 
  Search, 
  ChevronRight, 
  Shield, 
  LogOut, 
  Download, 
  Users, 
  Globe 
} from 'lucide-react';
import { ServerItem, User } from '../types.ts';

interface ServerSelectionProps {
  servers: ServerItem[];
  user: User;
  onSelectServer: (server: ServerItem) => void;
  onLogout: () => void;
  onOpenDownloadModal: () => void;
  activeServerId?: string | null;
}

export const ServerSelection: React.FC<ServerSelectionProps> = ({
  servers,
  user,
  onSelectServer,
  onLogout,
  onOpenDownloadModal,
  activeServerId,
}) => {
  const [search, setSearch] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string>('All');

  // Filter servers
  const filteredServers = servers.filter((srv) => {
    const matchesSearch =
      srv.code.toLowerCase().includes(search.toLowerCase()) ||
      srv.name.toLowerCase().includes(search.toLowerCase()) ||
      srv.region.toLowerCase().includes(search.toLowerCase());

    const matchesContinent =
      selectedContinent === 'All' || srv.continent === selectedContinent;

    return matchesSearch && matchesContinent;
  });

  const continents = ['All', 'Europe', 'Americas', 'Asia-Pacific', 'International'];

  return (
    <div className="relative min-h-screen bg-[#040806] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Subtle ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="ambient-light-orb absolute -top-40 right-1/4 w-[600px] h-[600px] bg-emerald-600/10 blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#123423_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-30 liquid-glass sticky top-0 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/25">
              <Shield className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-['Big_Shoulders_Display'] text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
                Manager Nol
              </span>
              <div className="text-[11px] font-mono text-slate-400">
                Server Hub · 30 Dedicated Worlds
              </div>
            </div>
          </div>

          {/* Zone 2: Manager Identity */}
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-300">
            <span className="text-slate-500">Active License:</span>
            <span className="text-white font-bold">@{user.username}</span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400">Ready for Matchday</span>
          </div>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenDownloadModal}
              className="liquid-btn-secondary text-xs py-2 px-3.5"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Export ZIP</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-red-950/40 border border-white/10 hover:border-red-500/30 text-xs text-slate-300 hover:text-red-300 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Server Selection Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Title Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">
              Step 1 of 2 · World Selection
            </div>
            <h1 className="font-['Big_Shoulders_Display'] text-4xl sm:text-5xl font-black uppercase text-white tracking-tight">
              Select A Game Server
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Choose from 30 persistent global football ecosystems. Each server hosts exactly 30 unique clubs with an independent €100,000,000 transfer warchest.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-300 liquid-glass px-4 py-2.5 rounded-xl border border-white/10 shrink-0">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Active Universe: <strong className="text-emerald-400 font-bold tabular-nums">30 / 30 Online</strong></span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 liquid-glass p-3.5 sm:p-4 rounded-2xl border border-white/10">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code (e.g. EU01, ENG02) or region..."
              className="liquid-input w-full pl-10 pr-4 text-xs sm:text-sm"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {continents.map((cont) => (
              <button
                key={cont}
                onClick={() => setSelectedContinent(cont)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedContinent === cont
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                {cont}
              </button>
            ))}
          </div>
        </div>

        {/* Server Cards Grid - Exactly 30 servers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredServers.map((srv) => {
            const isUserCurrentServer = activeServerId === srv.id;
            return (
              <div
                key={srv.id}
                className={`relative group rounded-2xl liquid-glass-card p-5 flex flex-col justify-between border ${
                  isUserCurrentServer
                    ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.25)] bg-[#0d2217]/80'
                    : 'border-white/[0.08]'
                }`}
              >
                {/* Top Row: Server Code & Status */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-xl bg-black/70 border border-emerald-500/30 text-emerald-400 font-['Big_Shoulders_Display'] text-2xl font-black tracking-wider tabular-nums">
                      {srv.code}
                    </div>
                    <div>
                      <h3 className="font-['Big_Shoulders_Display'] text-2xl font-bold uppercase text-white leading-tight group-hover:text-emerald-400 transition-colors">
                        {srv.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">
                        {srv.region} · {srv.continent}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                    Online
                  </span>
                </div>

                {/* Metrics Row: Clubs Occupancy & Ping */}
                <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-xl bg-black/40 border border-white/5 text-xs font-mono">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-500" />
                      <span>Clubs</span>
                    </div>
                    <div className="text-slate-200 font-bold mt-0.5 tabular-nums">
                      {srv.claimedClubs} / 30 Claimed
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                      <Wifi className="w-3 h-3 text-slate-500" />
                      <span>Latency</span>
                    </div>
                    <div className="text-emerald-400 font-bold mt-0.5 tabular-nums">
                      ~{srv.basePing} ms
                    </div>
                  </div>
                </div>

                {/* Occupancy bar */}
                <div className="w-full bg-black/70 rounded-full h-1.5 mb-4 overflow-hidden border border-white/5">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-emerald-300 h-1.5 rounded-full transition-all"
                    style={{ width: `${Math.max(6, (srv.claimedClubs / 30) * 100)}%` }}
                  />
                </div>

                {/* Select Server Button */}
                <button
                  onClick={() => onSelectServer(srv)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs uppercase font-extrabold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isUserCurrentServer
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/25'
                      : 'liquid-btn-secondary w-full hover:border-emerald-500/60 hover:text-white'
                  }`}
                >
                  <span>{isUserCurrentServer ? 'Resume Server' : 'Select Server'}</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            );
          })}
        </div>

        {filteredServers.length === 0 && (
          <div className="text-center py-12 liquid-glass rounded-2xl border border-white/10">
            <p className="text-slate-400 text-sm">No servers match your query &ldquo;{search}&rdquo;.</p>
            <button
              onClick={() => { setSearch(''); setSelectedContinent('All'); }}
              className="mt-3 liquid-btn-secondary text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
