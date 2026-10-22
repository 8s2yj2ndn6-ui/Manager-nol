import React from 'react';
import { Player, PlayerRank } from '../types.ts';

export const PlayerCard: React.FC<{ player: Player; onClick?: () => void }> = ({ player, onClick }) => {
  const getRankColor = (rank: PlayerRank) => {
    switch (rank) {
      case 'Weak': return 'text-slate-400';
      case 'Average': return 'text-emerald-400';
      case 'Strong': return 'text-blue-400';
      case 'Worldclass': return 'text-purple-400';
      case 'Top Tier': return 'text-amber-400';
      default: return 'text-white';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`p-3.5 rounded-2xl liquid-glass-card flex items-center justify-between border border-white/[0.08] transition-all ${
        onClick ? 'cursor-pointer hover:border-emerald-500/40 hover:bg-[#0c1c14]' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center font-['Big_Shoulders_Display'] font-black text-sm text-slate-300">
          {player.number}
        </div>
        <div>
          <div className="text-sm font-bold text-slate-100 leading-tight">{player.name}</div>
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
            <span className="font-semibold text-emerald-400">{player.position}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className={`font-semibold ${getRankColor(player.rank)}`}>{player.rank}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-[10px] font-mono uppercase text-slate-500">Stamina</div>
        <div className="text-sm font-mono font-bold text-emerald-400 tabular-nums">{player.stamina}%</div>
      </div>
    </div>
  );
};
