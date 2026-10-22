import React, { useState } from 'react';
import { Player, PositionCategory, PlayerRank } from '../types.ts';
import { ArrowUpDown } from 'lucide-react';
import { PlayerCardModal } from './PlayerCardModal.tsx';

interface SquadTabProps {
  squad: Player[];
  startingPlayerIds: Set<string>;
  onToggleStarter?: (player: Player) => void;
}

export const SquadTab: React.FC<SquadTabProps> = ({
  squad,
  startingPlayerIds,
  onToggleStarter,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'All' | PositionCategory>('All');
  const [sortBy, setSortBy] = useState<'number' | 'name' | 'rank' | 'stamina'>('number');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const categories: Array<'All' | PositionCategory> = ['All', 'Goalkeeper', 'Defender', 'Midfielder', 'Attacker'];

  const filteredSquad = squad.filter(player => {
    if (categoryFilter === 'All') return true;
    return player.positionCategory === categoryFilter;
  });

  const rankWeights: Record<PlayerRank, number> = {
    'Top Tier': 5,
    'Worldclass': 4,
    'Strong': 3,
    'Average': 2,
    'Weak': 1,
  };

  const sortedSquad = [...filteredSquad].sort((a, b) => {
    if (sortBy === 'number') return a.number - b.number;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'rank') return rankWeights[b.rank] - rankWeights[a.rank];
    if (sortBy === 'stamina') return b.stamina - a.stamina;
    return 0;
  });

  const getRankColor = (rank: PlayerRank) => {
    switch (rank) {
      case 'Top Tier': return 'text-amber-300';
      case 'Worldclass': return 'text-purple-300';
      case 'Strong': return 'text-blue-300';
      case 'Average': return 'text-emerald-300';
      default: return 'text-slate-400';
    }
  };

  const avgStamina = Math.round(squad.reduce((sum, p) => sum + p.stamina, 0) / (squad.length || 1));
  const avgAge = (squad.reduce((sum, p) => sum + p.age, 0) / (squad.length || 1)).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Squad Overview Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl liquid-glass border border-white/5">
          <div className="text-xs font-mono uppercase text-slate-400">Total Players</div>
          <div className="text-3xl font-['Big_Shoulders_Display'] font-black text-white mt-1 tabular-nums">
            {squad.length} / 22
          </div>
          <div className="text-[11px] font-mono text-emerald-400 mt-1">Full 22-man Roster</div>
        </div>

        <div className="p-4 rounded-2xl liquid-glass border border-white/5">
          <div className="text-xs font-mono uppercase text-slate-400">Starting XI</div>
          <div className="text-3xl font-['Big_Shoulders_Display'] font-black text-emerald-400 mt-1 tabular-nums">
            {startingPlayerIds.size} / 11
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">Matchday Starters</div>
        </div>

        <div className="p-4 rounded-2xl liquid-glass border border-white/5">
          <div className="text-xs font-mono uppercase text-slate-400">Avg. Squad Stamina</div>
          <div className="text-3xl font-['Big_Shoulders_Display'] font-black text-amber-300 mt-1 tabular-nums">
            {avgStamina}%
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">Physical Readiness</div>
        </div>

        <div className="p-4 rounded-2xl liquid-glass border border-white/5">
          <div className="text-xs font-mono uppercase text-slate-400">Average Squad Age</div>
          <div className="text-3xl font-['Big_Shoulders_Display'] font-black text-white mt-1 tabular-nums">
            {avgAge} yrs
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">Roster Prime Balance</div>
        </div>
      </div>

      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 liquid-glass p-3.5 sm:p-4 rounded-2xl border border-white/10">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'All' ? `All (${squad.length})` : cat}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort:</span>
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-black/70 border border-white/10 rounded-xl text-xs font-bold text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="number">Jersey Number</option>
            <option value="name">Player Name</option>
            <option value="rank">Player Rank</option>
            <option value="stamina">Stamina</option>
          </select>
        </div>
      </div>

      {/* Roster Table */}
      <div className="rounded-2xl liquid-glass border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-black/50 border-b border-white/5 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4 font-bold">#</th>
                <th className="py-3 px-4 font-bold">Player</th>
                <th className="py-3 px-4 font-bold">Pos</th>
                <th className="py-3 px-4 font-bold">Rank</th>
                <th className="py-3 px-4 font-bold">Age</th>
                <th className="py-3 px-4 font-bold">Nation</th>
                <th className="py-3 px-4 font-bold">Foot</th>
                <th className="py-3 px-4 font-bold">Stamina</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sortedSquad.map((player) => {
                const isStarter = startingPlayerIds.has(player.id);
                return (
                  <tr
                    key={player.id}
                    onClick={() => setSelectedPlayer(player)}
                    className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-bold text-slate-400 tabular-nums">
                      {player.number}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {player.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-sans">
                        {player.positionCategory}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-200">
                        {player.position}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${getRankColor(player.rank)}`}>
                        {player.rank}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 tabular-nums">
                      {player.age}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {player.nationality}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {player.preferredFoot}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-black/60 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              player.stamina >= 70 ? 'bg-emerald-500' :
                              player.stamina >= 30 ? 'bg-amber-500' :
                              'bg-rose-500'
                            }`}
                            style={{ width: `${player.stamina}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-300 tabular-nums">{player.stamina}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {isStarter ? (
                        <span className="font-mono text-emerald-400 font-bold uppercase text-[10px]">
                          Starter
                        </span>
                      ) : (
                        <span className="font-mono text-slate-500 uppercase text-[10px]">
                          Bench
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlayer(player);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-[11px] font-semibold transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Player Inspect Modal */}
      <PlayerCardModal
        player={selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        isStarter={selectedPlayer ? startingPlayerIds.has(selectedPlayer.id) : false}
        onToggleStarter={onToggleStarter}
      />
    </div>
  );
};
