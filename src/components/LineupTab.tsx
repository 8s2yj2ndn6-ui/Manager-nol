import React, { useState } from 'react';
import { Player, LineupConfig, PlayerRank, PositionCategory } from '../types.ts';
import { ALL_FORMATIONS, FormationPosition } from '../data/formations.ts';
import { MiniPitchFormation } from './MiniPitchFormation.tsx';
import { PlayerCardModal } from './PlayerCardModal.tsx';
import { 
  Shield, 
  Save, 
  Users, 
  Flame, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  X, 
  ChevronDown,
  Info
} from 'lucide-react';

interface LineupTabProps {
  squad: Player[];
  currentLineup: LineupConfig | null;
  onUpdateLineup: (lineup: LineupConfig) => Promise<void>;
}

export const LineupTab: React.FC<LineupTabProps> = ({ squad, currentLineup, onUpdateLineup }) => {
  const safeSquad = squad || [];
  const [selectedFormation, setSelectedFormation] = useState<string>(currentLineup?.formation || '4-4-2');
  const [teamEffort, setTeamEffort] = useState<'Medium' | 'High' | 'Extreme'>(currentLineup?.teamEffort || 'Medium');

  // Starting players map: positionId (e.g. 'pos_0', 'pos_1') -> playerId
  const [startingMap, setStartingMap] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    if (currentLineup && currentLineup.startingPlayers && currentLineup.startingPlayers.length > 0) {
      const formPositions = ALL_FORMATIONS[currentLineup.formation || '4-4-2'] || ALL_FORMATIONS['4-4-2'];
      currentLineup.startingPlayers.forEach((sp, idx) => {
        if (formPositions[idx]) {
          map[formPositions[idx].id] = sp.playerId;
        }
      });
    } else {
      const formPositions = ALL_FORMATIONS['4-4-2'];
      safeSquad.slice(0, 11).forEach((p, idx) => {
        if (formPositions[idx]) {
          map[formPositions[idx].id] = p.id;
        }
      });
    }
    return map;
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals
  const [formationModalOpen, setFormationModalOpen] = useState(false);
  const [activeSlotForAssign, setActiveSlotForAssign] = useState<FormationPosition | null>(null);
  const [inspectingPlayer, setInspectingPlayer] = useState<Player | null>(null);

  const formationPositions: FormationPosition[] = ALL_FORMATIONS[selectedFormation] || ALL_FORMATIONS['4-4-2'];
  const assignedPlayerIds = new Set(Object.values(startingMap));

  const benchPlayers = safeSquad.filter(p => !assignedPlayerIds.has(p.id));

  // Swap / Assign player into position slot
  const handleAssignPlayerToSlot = (slotId: string, playerId: string) => {
    setStartingMap(prev => {
      const next = { ...prev };
      let existingSlotOfPlayer: string | null = null;
      for (const [k, v] of Object.entries(next)) {
        if (v === playerId) {
          existingSlotOfPlayer = k;
          break;
        }
      }

      const currentPlayerInTargetSlot = next[slotId];

      if (existingSlotOfPlayer) {
        if (currentPlayerInTargetSlot) {
          next[existingSlotOfPlayer] = currentPlayerInTargetSlot;
        } else {
          delete next[existingSlotOfPlayer];
        }
      }

      next[slotId] = playerId;
      return next;
    });
    setActiveSlotForAssign(null);
  };

  const handleRemoveFromSlot = (slotId: string) => {
    setStartingMap(prev => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
    setActiveSlotForAssign(null);
  };

  const roleToCategory = (role: 'GK' | 'DEF' | 'MID' | 'ATT'): PositionCategory => {
    switch (role) {
      case 'GK': return 'Goalkeeper';
      case 'DEF': return 'Defender';
      case 'MID': return 'Midfielder';
      case 'ATT': return 'Attacker';
    }
  };

  // Smart Auto-Fill 11 Starters
  const handleAutoFill = () => {
    const next: Record<string, string> = {};
    const used = new Set<string>();

    formationPositions.forEach((pos) => {
      let candidate = safeSquad.find(p => !used.has(p.id) && p.position === pos.label);
      if (!candidate) {
        candidate = safeSquad.find(p => !used.has(p.id) && p.positionCategory === roleToCategory(pos.role));
      }
      if (!candidate) {
        candidate = safeSquad.find(p => !used.has(p.id));
      }

      if (candidate) {
        next[pos.id] = candidate.id;
        used.add(candidate.id);
      }
    });

    setStartingMap(next);
    setSuccessMsg('Tactical Auto-Fill optimized 11 starting positions based on player roles!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleClear = () => {
    setStartingMap({});
  };

  const handleSave = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const startingPlayersList: Array<{ playerId: string; position: string }> = [];
    formationPositions.forEach((pos) => {
      const pId = startingMap[pos.id];
      if (pId) {
        startingPlayersList.push({
          playerId: pId,
          position: pos.label,
        });
      }
    });

    if (startingPlayersList.length !== 11) {
      setErrorMsg(`A complete matchday lineup requires exactly 11 players. You currently have ${startingPlayersList.length} assigned.`);
      return;
    }

    setSaving(true);
    try {
      await onUpdateLineup({
        formation: selectedFormation,
        teamEffort,
        startingPlayers: startingPlayersList,
      });
      setSuccessMsg(`Tactics Saved! Formation ${selectedFormation} with ${teamEffort} team effort confirmed.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save lineup.');
    } finally {
      setSaving(false);
    }
  };

  const getPositionCategoryColor = (cat: PositionCategory) => {
    switch (cat) {
      case 'Goalkeeper': return 'bg-amber-500 text-slate-950 border-amber-400';
      case 'Defender': return 'bg-blue-600 text-white border-blue-400';
      case 'Midfielder': return 'bg-emerald-600 text-white border-emerald-400';
      case 'Attacker': return 'bg-rose-600 text-white border-rose-400';
      default: return 'bg-slate-700 text-white border-slate-500';
    }
  };

  const getRankColor = (rank: PlayerRank) => {
    switch (rank) {
      case 'Top Tier': return 'text-amber-300';
      case 'Worldclass': return 'text-purple-300';
      case 'Strong': return 'text-blue-300';
      case 'Average': return 'text-emerald-300';
      default: return 'text-slate-400';
    }
  };

  const getConditionColor = (stamina: number) => {
    if (stamina >= 70) return 'text-emerald-400';
    if (stamina >= 30) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="space-y-6">
      {/* Tactical Command Header */}
      <div className="rounded-3xl liquid-glass-elevated p-5 sm:p-6 border border-white/10 shadow-2xl flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        {/* Left: Formation & Unified Team Effort */}
        <div className="flex flex-wrap items-center gap-6">
          {/* Formation Trigger Button */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tactical Formation</span>
            </label>
            <button
              type="button"
              onClick={() => setFormationModalOpen(true)}
              className="flex items-center gap-3 px-4 py-2.5 bg-black/60 hover:bg-black/80 border border-white/15 rounded-2xl text-white font-bold text-sm transition-all cursor-pointer shadow-inner min-w-[210px] justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-mono text-xs font-black">
                  15
                </div>
                <div className="text-left">
                  <div className="font-['Big_Shoulders_Display'] text-xl font-black tracking-wider leading-none text-white">
                    {selectedFormation}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                    15 Formations Available
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
            </button>
          </div>

          {/* SINGLE TEAM-WIDE EFFORT SELECTOR */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Team-Wide Effort</span>
              <span className="text-[10px] font-mono text-slate-500">(All 11 Players)</span>
            </label>
            <div className="inline-flex p-1 bg-black/60 border border-white/15 rounded-2xl">
              {(
                [
                  { level: 'Medium', burn: '~14 Stamina', desc: 'Standard Tempo' },
                  { level: 'High', burn: '~22 Stamina', desc: 'Intensive High Press' },
                  { level: 'Extreme', burn: '~32 Stamina', desc: 'Maximum Overload' },
                ] as const
              ).map(({ level, burn, desc }) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setTeamEffort(level)}
                  title={`${level} Effort: ${desc} (${burn})`}
                  className={`px-4 py-2 rounded-xl text-xs uppercase font-extrabold tracking-wider transition-all cursor-pointer flex flex-col items-center ${
                    teamEffort === level
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span>{level}</span>
                  <span className={`text-[9px] font-mono font-normal tracking-normal ${teamEffort === level ? 'text-slate-950' : 'text-slate-500'}`}>
                    {burn}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <button
            onClick={handleClear}
            className="liquid-btn-secondary text-xs"
          >
            Clear XI
          </button>

          <button
            onClick={handleAutoFill}
            className="liquid-btn-secondary text-xs flex items-center gap-2 group"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-180 transition-transform duration-500" />
            <span>Auto-Pick XI</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="liquid-btn-primary text-xs flex items-center gap-2"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>{saving ? 'Saving...' : 'Save Lineup & Tactics'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-3 shadow-xl">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-3 shadow-xl">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Tactical Pitch & Squad Bench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* PITCH VISUALIZER (8 COLS) */}
        <div className="lg:col-span-8 rounded-3xl liquid-glass-elevated p-5 sm:p-6 relative overflow-hidden border border-emerald-500/20 shadow-2xl flex flex-col">
          {/* Pitch Top Bar */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
            <div>
              <h3 className="font-['Big_Shoulders_Display'] text-2xl font-black uppercase tracking-wider text-white">
                Starting XI · {selectedFormation}
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-slate-400">Team Effort:</span>
              <span className="text-emerald-400 font-bold uppercase">
                {teamEffort}
              </span>
              <span className="text-slate-600">·</span>
              <span className={`font-bold tabular-nums ${Object.keys(startingMap).length === 11 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {Object.keys(startingMap).length} / 11 Assigned
              </span>
            </div>
          </div>

          {/* Authentic Tactical Pitch Surface */}
          <div className="relative w-full h-[620px] pitch-stripes rounded-2xl border-2 border-emerald-500/30 overflow-hidden shadow-2xl select-none">
            {/* Pitch Markings */}
            <div className="absolute inset-4 border border-white/30 rounded-lg pointer-events-none" />
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-[1px] bg-white/30 pointer-events-none" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 border border-white/30 rounded-full pointer-events-none" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/80 rounded-full pointer-events-none" />
            
            {/* Penalty boxes */}
            <div className="absolute left-1/2 -translate-x-1/2 top-4 w-56 h-24 border-b border-x border-white/30 pointer-events-none" />
            <div className="absolute left-1/2 -translate-x-1/2 top-4 w-24 h-10 border-b border-x border-white/20 pointer-events-none" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-56 h-24 border-t border-x border-white/30 pointer-events-none" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-24 h-10 border-t border-x border-white/20 pointer-events-none" />

            {/* 11 Formation Tactical Position Tokens */}
            {formationPositions.map((pos) => {
              const assignedPlayerId = startingMap[pos.id];
              const player = assignedPlayerId ? safeSquad.find(p => p.id === assignedPlayerId) : null;

              return (
                <div
                  key={pos.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-20 cursor-pointer"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  onClick={() => setActiveSlotForAssign(pos)}
                >
                  {/* Position Badge & Marker */}
                  <div className="relative">
                    {player ? (
                      <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-b from-[#14261c] to-[#08120c] border-2 border-emerald-400/90 shadow-2xl flex flex-col items-center justify-center p-1 group-hover:scale-105 group-hover:border-emerald-300 transition-all">
                        <div className="text-[10px] font-mono uppercase font-black text-emerald-400 leading-none">
                          #{player.number}
                        </div>
                        <div className="font-['Big_Shoulders_Display'] text-xs font-black uppercase text-white leading-tight">
                          {pos.label}
                        </div>
                        {/* Mini Stamina Bar */}
                        <div className="w-8 h-1 rounded-full bg-black/60 overflow-hidden mt-1">
                          <div
                            className={`h-full ${
                              player.stamina >= 70 ? 'bg-emerald-400' :
                              player.stamina >= 30 ? 'bg-amber-400' : 'bg-rose-400'
                            }`}
                            style={{ width: `${player.stamina}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-black/75 border-2 border-dashed border-amber-400/60 flex flex-col items-center justify-center p-1 group-hover:border-amber-300 group-hover:scale-105 transition-all shadow-lg">
                        <span className="text-[10px] font-mono font-bold text-amber-300 uppercase">
                          {pos.label}
                        </span>
                        <span className="text-[9px] font-mono text-amber-400 font-bold mt-0.5">
                          + Assign
                        </span>
                      </div>
                    )}

                    {/* Small category role indicator */}
                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border text-[8px] font-bold flex items-center justify-center shadow ${getPositionCategoryColor(roleToCategory(pos.role))}`}>
                      {pos.role}
                    </div>
                  </div>

                  {/* Player Nameplate Below */}
                  {player ? (
                    <div className="mt-1 flex flex-col items-center bg-black/90 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10 text-center shadow-2xl max-w-[120px]">
                      <span className="font-bold text-[11px] text-white truncate max-w-[110px] leading-tight">
                        {player.name}
                      </span>
                      <div className="flex items-center gap-1.5 text-[9px] font-mono">
                        <span className={`font-semibold ${getRankColor(player.rank)}`}>
                          {player.rank}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className={`tabular-nums ${getConditionColor(player.stamina)}`}>
                          {player.stamina}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1 px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-500/40 text-[9px] font-mono text-amber-300 font-bold">
                      Open Slot
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Pitch Hint */}
          <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              <span>Click any player node on pitch to assign or swap positions</span>
            </span>
            <span className="tabular-nums">Bench Reserves: {benchPlayers.length} / 11</span>
          </div>
        </div>

        {/* BENCH & RESERVES PANEL (4 COLS) */}
        <div className="lg:col-span-4 rounded-3xl liquid-glass-elevated border border-white/10 p-5 sm:p-6 flex flex-col shadow-2xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <h3 className="font-['Big_Shoulders_Display'] text-xl font-bold uppercase text-white">
                Bench Reserves ({benchPlayers.length})
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Ready for Sub
            </span>
          </div>

          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {benchPlayers.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-mono">
                All 22 players are assigned or none available on bench.
              </div>
            ) : (
              benchPlayers.map((player) => {
                return (
                  <div
                    key={player.id}
                    className="p-3 rounded-2xl liquid-glass-card flex items-center justify-between gap-3 group border border-white/5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-black/70 border border-white/10 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[8px] font-mono text-slate-400">NO.</span>
                        <span className="font-['Big_Shoulders_Display'] text-lg font-black text-white leading-none tabular-nums">
                          {player.number}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                          <span className="truncate">{player.name}</span>
                          <span className="text-[10px] font-mono text-emerald-400 font-semibold shrink-0">
                            ({player.position})
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 text-[10px] font-mono text-slate-400">
                          <span className={`font-semibold ${getRankColor(player.rank)}`}>
                            {player.rank}
                          </span>
                          <span className="text-slate-600">·</span>
                          <span className={`tabular-nums ${getConditionColor(player.stamina)}`}>
                            {player.stamina}% Stamina
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setInspectingPlayer(player)}
                        title="Inspect Player Attributes"
                        className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* MODAL 1: FORMATION SELECTOR (15 FORMATIONS WITH MINI-PITCH PREVIEWS) */}
      {formationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-4xl liquid-glass-elevated border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.85)] text-slate-100 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                  <Shield className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-['Big_Shoulders_Display'] text-2xl font-black uppercase text-white">
                    Select Tactical Formation
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    All 15 tactical formations with interactive visual pitch coordinates
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFormationModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formations Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 my-6 overflow-y-auto pr-1">
              {Object.keys(ALL_FORMATIONS).map((form) => {
                const isSelected = selectedFormation === form;
                return (
                  <button
                    key={form}
                    type="button"
                    onClick={() => {
                      setSelectedFormation(form);
                      setFormationModalOpen(false);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col items-center gap-2 cursor-pointer text-center group ${
                      isSelected
                        ? 'bg-[#102d1f] border-emerald-400 shadow-xl shadow-emerald-500/20 scale-[1.02]'
                        : 'liquid-glass-card border-white/5 hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="font-['Big_Shoulders_Display'] text-2xl font-black uppercase tracking-wider text-white">
                      {form}
                    </div>
                    <MiniPitchFormation formation={form} active={isSelected} />
                    <span className={`text-[10px] font-mono font-bold uppercase mt-1 ${isSelected ? 'text-emerald-300' : 'text-slate-400 group-hover:text-emerald-400'}`}>
                      {isSelected ? 'Active System' : 'Select'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex justify-end">
              <button
                type="button"
                onClick={() => setFormationModalOpen(false)}
                className="liquid-btn-secondary text-xs uppercase"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: TACTICAL POSITION SWAP / ASSIGNMENT DRAWER */}
      {activeSlotForAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-xl liquid-glass-elevated border border-white/10 rounded-3xl p-6 shadow-[0_24px_64px_rgba(0,0,0,0.85)] text-slate-100 max-h-[85vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-['Big_Shoulders_Display'] text-xl font-black ${getPositionCategoryColor(roleToCategory(activeSlotForAssign.role))}`}>
                  {activeSlotForAssign.label}
                </div>
                <div>
                  <h3 className="font-['Big_Shoulders_Display'] text-2xl font-black uppercase text-white">
                    Assign Position · {activeSlotForAssign.label}
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    Category: {roleToCategory(activeSlotForAssign.role)} · Slot {activeSlotForAssign.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveSlotForAssign(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Currently assigned to this slot */}
            {startingMap[activeSlotForAssign.id] && (
              <div className="mt-4 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                <div className="text-xs font-mono">
                  <div className="text-slate-400 text-[10px] uppercase">Currently Assigned</div>
                  <div className="font-bold text-white text-sm">
                    {safeSquad.find(p => p.id === startingMap[activeSlotForAssign.id])?.name}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFromSlot(activeSlotForAssign.id)}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold cursor-pointer"
                >
                  Unassign to Bench
                </button>
              </div>
            )}

            {/* Candidate Players (22 squad) */}
            <div className="mt-4 flex-1 overflow-y-auto pr-1 space-y-2">
              <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">
                Available Squad Players (Click to Assign / Swap)
              </div>
              {safeSquad.map((player) => {
                const isAssignedToThis = startingMap[activeSlotForAssign.id] === player.id;
                const isAssignedElsewhere = Object.values(startingMap).includes(player.id) && !isAssignedToThis;
                const isExactPos = player.position === activeSlotForAssign.label;

                return (
                  <div
                    key={player.id}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isAssignedToThis
                        ? 'bg-emerald-950/60 border-emerald-400'
                        : isAssignedElsewhere
                        ? 'bg-black/40 border-white/5 opacity-80'
                        : 'liquid-glass-card border-white/10 hover:border-emerald-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-black/70 border border-white/10 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[8px] font-mono text-slate-400">NO.</span>
                        <span className="font-['Big_Shoulders_Display'] text-sm font-black text-white leading-none tabular-nums">
                          {player.number}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate flex items-center gap-2">
                          <span className="truncate">{player.name}</span>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">
                            {player.position}
                          </span>
                          {isExactPos && (
                            <span className="text-emerald-400 text-[10px] font-bold">
                              · Best Fit
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] font-mono text-slate-400">
                          <span className={`font-semibold ${getRankColor(player.rank)}`}>
                            {player.rank}
                          </span>
                          <span className="text-slate-600">·</span>
                          <span className={`tabular-nums ${getConditionColor(player.stamina)}`}>
                            {player.stamina}% St.
                          </span>
                          {isAssignedElsewhere && (
                            <span className="text-amber-400 text-[10px]">
                              (Will Swap)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setInspectingPlayer(player)}
                        title="View Full Player Card"
                        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        disabled={isAssignedToThis}
                        onClick={() => handleAssignPlayerToSlot(activeSlotForAssign.id, player.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                          isAssignedToThis
                            ? 'bg-emerald-500 text-slate-950 opacity-60 cursor-default'
                            : 'liquid-btn-primary py-1.5 text-xs'
                        }`}
                      >
                        {isAssignedToThis ? 'Assigned' : isAssignedElsewhere ? 'Swap' : 'Assign'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: PLAYER ATTRIBUTES INSPECTOR */}
      <PlayerCardModal
        player={inspectingPlayer}
        onClose={() => setInspectingPlayer(null)}
        isStarter={inspectingPlayer ? assignedPlayerIds.has(inspectingPlayer.id) : false}
      />
    </div>
  );
};
