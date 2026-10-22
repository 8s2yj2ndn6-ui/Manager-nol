import React from 'react';
import { ALL_FORMATIONS } from '../data/formations.ts';

interface MiniPitchFormationProps {
  formation: string;
  className?: string;
  active?: boolean;
}

export const MiniPitchFormation: React.FC<MiniPitchFormationProps> = ({
  formation,
  className = '',
  active = false,
}) => {
  const positions = ALL_FORMATIONS[formation] || ALL_FORMATIONS['4-4-2'];

  return (
    <div
      className={`relative w-20 h-28 rounded-xl overflow-hidden border transition-all ${
        active
          ? 'border-emerald-400 bg-[#0d2a1c] shadow-[0_0_16px_rgba(16,185,129,0.35)] ring-1 ring-emerald-400/50'
          : 'border-white/10 bg-[#07150e] hover:border-emerald-500/40'
      } ${className}`}
    >
      {/* Subtle grass strips */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[repeating-linear-gradient(180deg,#ffffff,#ffffff_14px,transparent_14px,transparent_28px)]" />

      {/* Pitch markings */}
      <div className="absolute inset-1.5 border border-white/20 rounded pointer-events-none" />
      <div className="absolute inset-x-1.5 top-1/2 -translate-y-1/2 h-[1px] bg-white/20 pointer-events-none" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border border-white/20 rounded-full pointer-events-none" />
      
      {/* 11 position dots */}
      {positions.map((pos) => (
        <div
          key={pos.id}
          className={`absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full border shadow-sm ${
            pos.role === 'GK'
              ? 'bg-amber-400 border-amber-200'
              : pos.role === 'DEF'
              ? 'bg-blue-400 border-blue-200'
              : pos.role === 'MID'
              ? 'bg-emerald-400 border-emerald-200'
              : 'bg-rose-400 border-rose-200'
          }`}
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        />
      ))}

      {/* Formation label overlay */}
      <div className="absolute bottom-0 inset-x-0 text-center text-[9px] font-mono font-bold tracking-tight text-white/90 bg-black/75 py-0.5 border-t border-white/10">
        {formation}
      </div>
    </div>
  );
};
