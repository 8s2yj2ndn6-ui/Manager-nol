import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Coins, 
  Landmark, 
  CheckCircle2, 
  Lock, 
  Building2, 
  Calendar, 
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
    <div className="min-h-screen bg-[#070c09] text-slate-100 flex flex-col">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-[#09140e]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Back button & Server breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToServers}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Servers</span>
            </button>

            <div className="h-5 w-[1px] bg-white/10" />

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold">
                {server.code}
              </span>
              <span className="font-['Big_Shoulders_Display'] text-xl font-bold uppercase text-white">
                {server.name}
              </span>
            </div>
          </div>

          {/* User badge & actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
              <span className="text-slate-400">Manager:</span>
              <span className="text-emerald-400 font-bold">@{user.username}</span>
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

      {/* Main Clubs View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Banner Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-mono text-emerald-400 uppercase tracking-wider mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Step 2: Choose Your Football Club</span>
            </div>
            <h1 className="font-['Big_Shoulders_Display'] text-4xl sm:text-5xl font-black uppercase text-white tracking-tight">
              Select A Club in {server.name} ({server.code})
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              There are <strong className="text-white">exactly 30 clubs</strong> competing in this server universe. 
              Signing with any available club unlocks an immediate <strong className="text-emerald-400 font-semibold">€100,000,000 transfer warchest</strong>.
            </p>
          </div>

          {/* Guaranteed Budget Callout */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-950/80 to-[#0e2417] px-4 py-3 rounded-2xl border border-emerald-500/40 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-300">Official Starting Budget</div>
              <div className="text-xl font-['Big_Shoulders_Display'] font-black text-amber-300">
                €100,000,000
              </div>
            </div>
          </div>
        </div>

        {/* Global Error Banner */}
        {claimError && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{claimError}</span>
            </div>
            <button
              onClick={() => setClaimError(null)}
              className="text-xs uppercase font-bold text-red-400 hover:text-red-200"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#09150f] p-4 rounded-2xl border border-white/5">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by club name, stadium, or city..."
              className="w-full pl-9 pr-4 py-2 bg-black/50 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-black/40 text-slate-400 hover:text-white'
              }`}
            >
              All Clubs ({clubs.length})
            </button>
            <button
              onClick={() => setFilterMode('available')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                filterMode === 'available'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-black/40 text-slate-400 hover:text-white'
              }`}
            >
              Available ({clubs.filter(c => !c.managerId).length})
            </button>
            <button
              onClick={() => setFilterMode('claimed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                filterMode === 'claimed'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-black/40 text-slate-400 hover:text-white'
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
                className={`relative rounded-2xl bg-[#09150f] border p-5 flex flex-col justify-between transition-all duration-200 group ${
                  isClaimedByMe
                    ? 'border-emerald-400 bg-[#0d2218] shadow-[0_0_30px_rgba(16,185,129,0.25)]'
                    : isClaimedByOther
                    ? 'border-white/5 opacity-75 bg-[#08100c]'
                    : 'border-white/10 hover:border-emerald-500/40 hover:bg-[#0c1c14]'
                }`}
              >
                {/* Top Badge & Status Header */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    {/* Club Crest Simulation */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-['Big_Shoulders_Display'] text-xl font-black shadow-md border"
                        style={{
                          backgroundColor: club.primaryColor,
                          color: club.secondaryColor === '#ffffff' ? '#ffffff' : '#f8fafc',
                          borderColor: club.accentColor,
                        }}
                      >
                        {club.shortCode}
                      </div>
                      <div>
                        <h3 className="font-['Big_Shoulders_Display'] text-2xl font-black uppercase text-white group-hover:text-emerald-300 transition-colors">
                          {club.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-mono">
                          {club.city} • Est. {club.foundedYear}
                        </p>
                      </div>
                    </div>

                    {/* Ownership Status Pill */}
                    {isClaimedByMe && (
                      <span className="px-2.5 py-1 rounded-md bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                        YOUR CLUB
                      </span>
                    )}
                    {isClaimedByOther && (
                      <span className="px-2.5 py-1 rounded-md bg-red-950/80 border border-red-500/40 text-red-300 text-[10px] font-mono uppercase">
                        OCCUPIED
                      </span>
                    )}
                    {isAvailable && (
                      <span className="px-2.5 py-1 rounded-md bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono uppercase">
                        AVAILABLE
                      </span>
                    )}
                  </div>

                  {/* Club Details Box */}
                  <div className="space-y-2 py-3 border-t border-b border-white/5 my-3 text-xs font-mono">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Landmark className="w-3.5 h-3.5 text-slate-400" />
                        Home Stadium:
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
                      <span className="font-semibold">
                        {club.stadiumCapacity.toLocaleString()} seats
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        Transfer Budget:
                      </span>
                      <span className="font-bold text-amber-400">
                        €{club.transferBudget.toLocaleString()}
                      </span>
                    </div>

                    {/* Manager if Claimed */}
                    {club.managerUsername && (
                      <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-white/5">
                        <span className="text-slate-500">Current Manager:</span>
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
                      className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold uppercase text-xs tracking-wider rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Enter Club Dashboard</span>
                    </button>
                  ) : isClaimedByOther ? (
                    <button
                      disabled
                      className="w-full py-2.5 px-4 bg-white/5 text-slate-500 font-semibold uppercase text-xs tracking-wider rounded-xl border border-white/5 flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Claimed by @{club.managerUsername}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleClaimInitiate(club)}
                      disabled={claimingClubId === club.id}
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold uppercase text-xs tracking-wider rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
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
          <div className="text-center py-12 bg-[#09150f] rounded-2xl border border-white/5">
            <p className="text-slate-400 text-sm">No clubs found matching your search filter.</p>
            <button
              onClick={() => { setSearch(''); setFilterMode('all'); }}
              className="mt-3 px-4 py-2 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-lg hover:bg-emerald-500/30"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Confirmation Modal before atomic club claim */}
      {confirmModalClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0c1812] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(16,185,129,0.2)] text-slate-100">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-['Big_Shoulders_Display'] text-2xl font-black shadow-lg border"
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
                <span className="font-bold text-white">{confirmModalClub.stadiumCapacity.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-400 pt-2 border-t border-white/10">
                <span className="font-bold uppercase">Starting Warchest:</span>
                <span className="text-base font-black text-amber-300">€100,000,000</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              By confirming, <strong className="text-white">@{user.username}</strong> will be registered as the sole manager of <strong className="text-white">{confirmModalClub.name}</strong> on server <strong className="text-white">{server.code}</strong>. 
              The initial transfer budget of €100,000,000 will be locked to your club in the backend database.
            </p>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfirmModalClub(null)}
                className="py-3 px-4 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmClaim}
                disabled={Boolean(claimingClubId)}
                className="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {claimingClubId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing Contract...</span>
                  </>
                ) : (
                  <>
                    <span>Sign Contract (€100M)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
