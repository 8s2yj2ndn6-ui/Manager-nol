import React from 'react';
import { Player, PlayerRank } from '../types.ts';
import { Shield, ChevronDown } from 'lucide-react';

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
      className={`p-3 rounded-xl border border-white/5 bg-[#0e1a14] flex items-center justify-between transition-all ${onClick ? 'cursor-pointer hover:border-emerald-500/40' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-black/50 flex items-center justify-center font-bold text-xs text-slate-500">
          {player.name[0]}
        </div>
        <div>
          <div className="text-sm font-bold text-slate-100">{player.name}</div>
          <div className={`text-[10px] font-mono font-bold uppercase ${getRankColor(player.rank)}`}>
            {player.rank}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs text-slate-400">Stamina</div>
        <div className="text-sm font-mono font-bold text-emerald-400">{player.stamina}</div>
      </div>
    </div>
  );
};
