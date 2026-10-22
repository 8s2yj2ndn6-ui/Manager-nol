import React, { useState } from 'react';
import { Player, LineupConfig } from '../types.ts';
import { PlayerCard } from './PlayerCard.tsx';
import { Save, Users, AlertTriangle } from 'lucide-react';

interface LineupTabProps {
  squad: Player[];
  currentLineup: LineupConfig | null;
  onUpdateLineup: (lineup: LineupConfig) => Promise<void>;
}

export const LineupTab: React.FC<LineupTabProps> = ({ squad, currentLineup, onUpdateLineup }) => {
  const [lineup, setLineup] = useState<LineupConfig>(currentLineup || { formation: '4-4-2', startingPlayers: [] });
  const [saving, setSaving] = useState(false);

  const togglePlayer = (player: Player) => {
    const isSelected = lineup.startingPlayers.find(p => p.playerId === player.id);
    if (isSelected) {
      setLineup(prev => ({
        ...prev,
        startingPlayers: prev.startingPlayers.filter(p => p.playerId !== player.id)
      }));
    } else if (lineup.startingPlayers.length < 11) {
      setLineup(prev => ({
        ...prev,
        startingPlayers: [...prev.startingPlayers, { playerId: player.id, position: 'GK', effort: 'Medium' }]
      }));
    }
  };

  const saveLineup = async () => {
    setSaving(true);
    await onUpdateLineup(lineup);
    setSaving(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="card flex items-center justify-between">
          <h2 className="text-2xl font-bold font-['Big_Shoulders_Display'] uppercase">Tactical Setup</h2>
          <button 
            onClick={saveLineup}
            disabled={lineup.startingPlayers.length !== 11 || saving}
            className="btn btn-emerald"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Lineup'}
          </button>
        </div>
        
        {/* Pitch Area */}
        <div className="card h-[500px] relative bg-[#06341f] border-2 border-emerald-500/20 overflow-hidden">
            <div className="absolute inset-0 border-2 border-white/20 rounded"></div>
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-white/20"></div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/20 rounded-full"></div>
            
            {/* Players on pitch */}
            {lineup.startingPlayers.map((p, i) => (
                <div key={p.playerId} className="absolute w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold shadow-lg border border-white">
                    {i+1}
                </div>
            ))}
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="text-xl font-bold font-['Big_Shoulders_Display'] uppercase">Squad ({(squad || []).length})</h3>
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {(squad || []).map(p => (
            <PlayerCard key={p.id} player={p} onClick={() => togglePlayer(p)} />
          ))}
        </div>
      </div>
    </div>
  );
};
