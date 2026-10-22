import React from 'react';
import { Player } from '../types.ts';
import { X, Activity } from 'lucide-react';

interface PlayerCardModalProps {
  player: Player | null;
  onClose: () => void;
  isStarter?: boolean;
  onToggleStarter?: (player: Player) => void;
}

export const PlayerCardModal: React.FC<PlayerCardModalProps> = ({
  player,
  onClose,
  isStarter = false,
  onToggleStarter,
}) => {
  if (!player) return null;

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Top Tier': return 'text-amber-300';
      case 'Worldclass': return 'text-purple-300';
      case 'Strong': return 'text-blue-300';
      case 'Average': return 'text-emerald-300';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div 
        className="relative w-full max-w-lg liquid-glass-elevated rounded-3xl p-6 sm:p-7 border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.85)] text-slate-100 overflow-hidden"
        role="dialog"
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-emerald-500/15 blur-[60px] rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Card */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-800 border border-emerald-400/40 flex flex-col items-center justify-center shadow-lg shrink-0">
            <span className="text-[9px] font-mono uppercase text-slate-950 font-bold">NO.</span>
            <span className="font-['Big_Shoulders_Display'] text-3xl font-black text-slate-950 leading-none">
              {player.number}
            </span>
          </div>

          <div className="min-w-0 pr-8">
            <div className="flex items-center gap-2 mb-1 text-xs font-mono">
              <span className={`font-bold uppercase ${getRankColor(player.rank)}`}>
                {player.rank} Rank
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400 font-semibold">
                {player.position} ({player.positionCategory})
              </span>
              {isStarter && (
                <>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-amber-300 font-bold uppercase">
                    Starting XI
                  </span>
                </>
              )}
            </div>

            <h3 className="font-['Big_Shoulders_Display'] text-3xl font-black uppercase text-white truncate leading-none">
              {player.name}
            </h3>

            <p className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-1.5 flex-wrap">
              <span>{player.age} Years</span>
              <span className="text-slate-600">·</span>
              <span>{player.nationality}</span>
              <span className="text-slate-600">·</span>
              <span>{player.preferredFoot} Foot</span>
            </p>
          </div>
        </div>

        {/* Stamina & Condition Section */}
        <div className="p-4 rounded-2xl liquid-glass border border-white/5 mb-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Physical Stamina</span>
            </span>
            <span className="font-bold text-white flex items-center gap-2">
              <span className={`text-xs font-semibold ${
                player.condition === 'Great' ? 'text-emerald-400' :
                player.condition === 'Tired' ? 'text-amber-400' :
                'text-rose-400'
              }`}>
                {player.condition} Condition
              </span>
              <span className="text-slate-600">·</span>
              <span className="tabular-nums font-bold">{player.stamina}%</span>
            </span>
          </div>

          <div className="w-full bg-black/70 rounded-full h-2 overflow-hidden border border-white/5">
            <div 
              className={`h-full transition-all rounded-full ${
                player.stamina >= 70 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                player.stamina >= 30 ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                'bg-gradient-to-r from-rose-500 to-rose-400'
              }`}
              style={{ width: `${player.stamina}%` }}
            />
          </div>
        </div>

        {/* 6 Key Football Attributes Grid */}
        <div className="mb-6">
          <div className="text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider mb-3">
            Core Match Performance Attributes
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Pace', val: player.pace },
              { label: 'Shooting', val: player.shooting },
              { label: 'Passing', val: player.passing },
              { label: 'Dribbling', val: player.dribbling },
              { label: 'Defending', val: player.defending },
              { label: 'Physical', val: player.physical },
            ].map(({ label, val }) => (
              <div key={label} className="p-3 rounded-xl liquid-glass border border-white/5 text-center">
                <div className="text-2xl font-['Big_Shoulders_Display'] font-black text-white tabular-nums leading-none">
                  {val}
                </div>
                <div className="text-[10px] font-mono text-slate-400 uppercase mt-1">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3">
          {onToggleStarter && (
            <button
              onClick={() => {
                onToggleStarter(player);
                onClose();
              }}
              className={`flex-1 py-3 px-4 rounded-xl text-xs uppercase font-extrabold tracking-wider transition-all cursor-pointer ${
                isStarter
                  ? 'bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40'
                  : 'liquid-btn-primary'
              }`}
            >
              {isStarter ? 'Move to Bench Reserve' : 'Add to Starting XI'}
            </button>
          )}

          <button
            onClick={onClose}
            className="liquid-btn-secondary text-xs uppercase py-3 px-6"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
