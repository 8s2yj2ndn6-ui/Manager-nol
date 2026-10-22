import React, { useState } from 'react';
import { 
  Server, 
  Wifi, 
  Search, 
  ChevronRight, 
  Shield, 
  LogOut, 
  Download, 
  CheckCircle2, 
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
    <div className="min-h-screen bg-[#070c09] text-slate-100 flex flex-col">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-[#09140e]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Status */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20">
              <Shield className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-['Big_Shoulders_Display'] text-2xl font-extrabold uppercase tracking-wider text-white leading-tight">
                Manager Nol
              </div>
              <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                Server Selection • 30 Total
              </div>
            </div>
          </div>

          {/* User profile & actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400">Manager:</span>
              <span className="text-white font-bold">@{user.username}</span>
            </div>

            <button
              onClick={onOpenDownloadModal}
              title="Download project ZIP for Bolt.new"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Export ZIP</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-xs text-red-200 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Server Selection Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Title Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-mono text-emerald-400 uppercase tracking-wider mb-2">
              <Server className="w-3.5 h-3.5" />
              <span>Step 1: Choose Your Competitive World</span>
            </div>
            <h1 className="font-['Big_Shoulders_Display'] text-4xl sm:text-5xl font-black uppercase text-white tracking-tight">
              Select A Game Server
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Select any of the <strong className="text-white">30 official servers</strong> below. Each server hosts 30 independent clubs with a guaranteed €100,000,000 transfer warchest.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-black/40 px-3.5 py-2 rounded-xl border border-white/10 text-slate-300">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Total Servers: <strong className="text-emerald-400 font-bold">{servers.length} / 30 Active</strong></span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#09150f] p-4 rounded-2xl border border-white/5">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code (e.g. EU01, ENG02) or region..."
              className="w-full pl-9 pr-4 py-2 bg-black/50 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {continents.map((cont) => (
              <button
                key={cont}
                onClick={() => setSelectedContinent(cont)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedContinent === cont
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-black/30 text-slate-400 hover:text-white hover:bg-black/50'
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
                className={`relative group rounded-2xl bg-[#09150f] border transition-all duration-200 p-5 flex flex-col justify-between ${
                  isUserCurrentServer
                    ? 'border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.2)] bg-[#0d2017]'
                    : 'border-white/5 hover:border-emerald-500/40 hover:bg-[#0c1c14]'
                }`}
              >
                {/* Top Row: Server Code & Status */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-emerald-500/30 text-emerald-400 font-['Big_Shoulders_Display'] text-2xl font-black tracking-wider">
                      {srv.code}
                    </div>
                    <div>
                      <h3 className="font-['Big_Shoulders_Display'] text-xl font-bold uppercase text-white leading-tight group-hover:text-emerald-400 transition-colors">
                        {srv.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">
                        {srv.region}
                      </p>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-[10px] font-mono text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>ONLINE</span>
                  </div>
                </div>

                {/* Metrics Row: Clubs Occupancy & Ping */}
                <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-xl bg-black/40 border border-white/5 text-xs font-mono">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      <span>Clubs</span>
                    </div>
                    <div className="text-slate-200 font-bold mt-0.5">
                      {srv.claimedClubs} / 30 Claimed
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                      <Wifi className="w-3 h-3 text-slate-400" />
                      <span>Latency</span>
                    </div>
                    <div className="text-emerald-400 font-bold mt-0.5">
                      ~{srv.basePing} ms
                    </div>
                  </div>
                </div>

                {/* Progress bar for clubs claim */}
                <div className="w-full bg-black/60 rounded-full h-1.5 mb-4 overflow-hidden">
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
                      : 'bg-white/5 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 border border-white/10 hover:border-emerald-500'
                  }`}
                >
                  <span>{isUserCurrentServer ? 'Enter My Server' : 'Select Server'}</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            );
          })}
        </div>

        {filteredServers.length === 0 && (
          <div className="text-center py-12 bg-[#09150f] rounded-2xl border border-white/5">
            <p className="text-slate-400 text-sm">No servers match your search &ldquo;{search}&rdquo;.</p>
            <button
              onClick={() => { setSearch(''); setSelectedContinent('All'); }}
              className="mt-3 px-4 py-2 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-lg hover:bg-emerald-500/30"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
