import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Coins, 
  Landmark, 
  CheckCircle2, 
  Lock, 
  Users, 
  Loader2, 
  AlertCircle,
  Shield,
  Download,
  LogOut
} from 'lucide-react';
import { ClubItem, ServerItem, User } from '../types.ts';

interface ClubSelectionProps {
  server: ServerItem;
  clubs: ClubItem[];
  user: User;
  onBackToServers: () => void;
  onClaimClub: (club: ClubItem) => Promise<void>;
  onLogout: () => void;
  onOpenDownloadModal: () => void;
  activeClubId?: string | null;
}

export const ClubSelection: React.FC<ClubSelectionProps> = ({
  server,
  clubs,
  user,
  onBackToServers,
  onClaimClub,
  onLogout,
  onOpenDownloadModal,
  activeClubId,
}) => {
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'available' | 'claimed'>('all');
  const [claimingClubId, setClaimingClubId] = useState<string | null>(null);
  const [confirmModalClub, setConfirmModalClub] = useState<ClubItem | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);

  const filteredClubs = clubs.filter((club) => {
    const matchesSearch =
      club.name.toLowerCase().includes(search.toLowerCase()) ||
      club.city.toLowerCase().includes(search.toLowerCase()) ||
      club.stadiumName.toLowerCase().includes(search.toLowerCase()) ||
      club.shortCode.toLowerCase().includes(search.toLowerCase());

    const isClaimed = Boolean(club.managerId);
    if (filterMode === 'available') return matchesSearch && !isClaimed;
    if (filterMode === 'claimed') return matchesSearch && isClaimed;
    return matchesSearch;
  });

  const handleClaimInitiate = (club: ClubItem) => {
    setClaimError(null);
    setConfirmModalClub(club);
  };

  const handleConfirmClaim = async () => {
    if (!confirmModalClub) return;
    const club = confirmModalClub;
    setClaimingClubId(club.id);
    setClaimError(null);

    try {
      await onClaimClub(club);
      setConfirmModalClub(null);
    } catch (err: any) {
      setClaimError(err.message || 'Failed to claim club.');
    } finally {
      setClaimingClubId(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#040806] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Ambient background lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="ambient-light-orb absolute -top-40 left-1/4 w-[600px] h-[600px] bg-emerald-600/10 blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#123423_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />
      </div>

      {/* Top Header Bar: 3-Zone Contract */}
      <header className="relative z-30 liquid-glass sticky top-0 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Navigation & Server Info */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onBackToServers}
              className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              aria-label="Back to servers"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Servers</span>
            </button>

            <div className="h-5 w-[1px] bg-white/10" />

            <div className="flex items-center gap-2">
              <span className="font-['Big_Shoulders_Display'] text-2xl font-black uppercase text-white">
                {server.name}
              </span>
              <span className="font-mono text-xs font-bold text-emerald-400">
                ({server.code})
              </span>
            </div>
          </div>

          {/* Zone 2: Manager Context */}
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-300">
            <span className="text-slate-500">Manager:</span>
            <span className="text-white font-bold">@{user.username}</span>
            <span className="text-slate-600">·</span>
            <span>Select Your 2026 Club</span>
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

      {/* Main Clubs View */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Banner Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">
              Step 2 of 2 · Club Franchise Selection
            </div>
            <h1 className="font-['Big_Shoulders_Display'] text-4xl sm:text-5xl font-black uppercase text-white tracking-tight">
              Select A Club in {server.name}
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Exactly 30 clubs compete in this universe. Signing as head coach unlocks an instantaneous €100,000,000 warchest and complete authority over the 22-man roster.
            </p>
          </div>

          {/* Guaranteed Budget Callout */}
          <div className="flex items-center gap-3 liquid-glass px-4 py-3 rounded-2xl border border-white/10 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Starting Warchest</div>
              <div className="text-2xl font-['Big_Shoulders_Display'] font-black text-amber-300 tabular-nums leading-none">
                €100,000,000
              </div>
            </div>
          </div>
        </div>

        {/* Global Error Banner */}
        {claimError && (
          <div className="p-4 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{claimError}</span>
            </div>
            <button
              onClick={() => setClaimError(null)}
              className="text-xs uppercase font-bold text-red-400 hover:text-red-200 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 liquid-glass p-3.5 sm:p-4 rounded-2xl border border-white/10">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by club name, stadium, or city..."
              className="liquid-input w-full pl-10 pr-4 text-xs sm:text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                filterMode === 'all'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white'
              }`}
            >
              All Clubs ({clubs.length})
            </button>
            <button
              onClick={() => setFilterMode('available')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                filterMode === 'available'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white'
              }`}
            >
              Available ({clubs.filter(c => !c.managerId).length})
            </button>
            <button
              onClick={() => setFilterMode('claimed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                filterMode === 'claimed'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white'
              }`}
            >
              Claimed ({clubs.filter(c => c.managerId).length})
            </button>
          </div>
        </div>

        {/* Clubs Grid - Exactly 30 clubs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClubs.map((club) => {
            const isClaimedByMe = club.managerId === user.id || club.id === activeClubId;
            const isClaimedByOther = club.managerId && club.managerId !== user.id;
            const isAvailable = !club.managerId;

            return (
              <div
                key={club.id}
                className={`relative rounded-2xl liquid-glass-card p-5 flex flex-col justify-between border group ${
                  isClaimedByMe
                    ? 'border-emerald-400 bg-[#0d2218]/85 shadow-[0_0_30px_rgba(16,185,129,0.25)]'
                    : isClaimedByOther
                    ? 'border-white/[0.04] opacity-75 bg-[#060c09]'
                    : 'border-white/[0.08]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    {/* Club Crest Simulation */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-['Big_Shoulders_Display'] text-xl font-black shadow-md border shrink-0"
                        style={{
                          backgroundColor: club.primaryColor,
                          color: club.secondaryColor === '#ffffff' ? '#ffffff' : '#f8fafc',
                          borderColor: club.accentColor,
                        }}
                      >
                        {club.shortCode}
                      </div>
                      <div>
                        <h3 className="font-['Big_Shoulders_Display'] text-2xl font-black uppercase text-white group-hover:text-emerald-300 transition-colors leading-none">
                          {club.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-mono mt-1">
                          {club.city} · Est. {club.foundedYear}
                        </p>
                      </div>
                    </div>

                    {/* Ownership Status as clean text (Zero-Pill discipline) */}
                    {isClaimedByMe && (
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                        Your Club
                      </span>
                    )}
                    {isClaimedByOther && (
                      <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500">
                        Occupied
                      </span>
                    )}
                    {isAvailable && (
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-300">
                        Open
                      </span>
                    )}
                  </div>

                  {/* Club Details Box */}
                  <div className="space-y-2 py-3 border-t border-b border-white/[0.06] my-3 text-xs font-mono">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Landmark className="w-3.5 h-3.5 text-slate-400" />
                        Stadium:
                      </span>
                      <span className="font-semibold text-right truncate max-w-[170px]" title={club.stadiumName}>
                        {club.stadiumName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        Capacity:
                      </span>
                      <span className="font-semibold tabular-nums">
                        {club.stadiumCapacity.toLocaleString()} seats
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        Budget:
                      </span>
                      <span className="font-bold text-amber-300 tabular-nums">
                        €{club.transferBudget.toLocaleString()}
                      </span>
                    </div>

                    {club.managerUsername && (
                      <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-white/[0.04]">
                        <span className="text-slate-500">Manager:</span>
                        <span className="font-bold text-white">
                          @{club.managerUsername}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="mt-2">
                  {isClaimedByMe ? (
                    <button
                      onClick={() => onClaimClub(club)}
                      className="liquid-btn-primary w-full py-2.5 text-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Enter Club Dashboard</span>
                    </button>
                  ) : isClaimedByOther ? (
                    <button
                      disabled
                      className="w-full py-2.5 px-4 bg-white/[0.03] text-slate-500 font-semibold uppercase text-xs tracking-wider rounded-xl border border-white/5 flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Managed by @{club.managerUsername}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleClaimInitiate(club)}
                      disabled={claimingClubId === club.id}
                      className="liquid-btn-primary w-full py-2.5 text-xs"
                    >
                      {claimingClubId === club.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Assigning Club...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Claim Club (€100M)</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredClubs.length === 0 && (
          <div className="text-center py-12 liquid-glass rounded-2xl border border-white/10">
            <p className="text-slate-400 text-sm">No clubs found matching your search filter.</p>
            <button
              onClick={() => { setSearch(''); setFilterMode('all'); }}
              className="mt-3 liquid-btn-secondary text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      {confirmModalClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-lg liquid-glass-elevated rounded-3xl p-6 sm:p-8 border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.85)] text-slate-100">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-['Big_Shoulders_Display'] text-2xl font-black shadow-lg border shrink-0"
                style={{
                  backgroundColor: confirmModalClub.primaryColor,
                  color: confirmModalClub.secondaryColor === '#ffffff' ? '#ffffff' : '#f8fafc',
                  borderColor: confirmModalClub.accentColor,
                }}
              >
                {confirmModalClub.shortCode}
              </div>
              <div>
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                  Manager Contract Confirmation
                </span>
                <h3 className="font-['Big_Shoulders_Display'] text-3xl font-black uppercase text-white leading-tight">
                  {confirmModalClub.name}
                </h3>
              </div>
            </div>

            {/* Contract Terms Box */}
            <div className="bg-black/50 rounded-2xl p-4 border border-white/10 space-y-3 mb-6 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-500">Target Server:</span>
                <span className="font-bold text-white">{server.name} ({server.code})</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-500">Home Ground:</span>
                <span className="font-bold text-white">{confirmModalClub.stadiumName}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-500">Seating Capacity:</span>
                <span className="font-bold text-white tabular-nums">{confirmModalClub.stadiumCapacity.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-400 pt-2 border-t border-white/10">
                <span className="font-bold uppercase">Starting Warchest:</span>
                <span className="text-lg font-black text-amber-300 tabular-nums">€100,000,000</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              By confirming, <strong className="text-white">@{user.username}</strong> will be appointed head coach of <strong className="text-white">{confirmModalClub.name}</strong> on server <strong className="text-white">{server.code}</strong>. 
              The initial transfer budget of €100,000,000 and the 22-man squad will be assigned to your account.
            </p>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfirmModalClub(null)}
                className="liquid-btn-secondary text-xs uppercase"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmClaim}
                disabled={Boolean(claimingClubId)}
                className="liquid-btn-primary text-xs uppercase"
              >
                {claimingClubId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing...</span>
                  </>
                ) : (
                  <span>Sign Contract (€100M)</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
