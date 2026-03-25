import React from 'react';
import { Button } from '../components/Button';

export function WorkoutCompleteScreen({ onNavigate, settings, currentRound, onAddRound }) {
  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m > 0 ? `${m}m ` : ''}${s}s`;
  };

  // Approximate time spent
  const totalActiveTime = (currentRound ?? 1) * (settings?.roundDuration ?? 60);

  return (
    <div className="flex flex-col min-h-screen p-[2rem] bg-brand-background border-t-[8px] border-t-brand-primary">
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <h1 className="font-display text-[3.5rem] md:text-[4.5rem] tracking-tight leading-[1.1] mb-6 text-brand-primary drop-shadow-[0_0_15px_rgba(255,143,115,0.2)]">
          WORKOUT<br/>COMPLETE
        </h1>
        
        <div className="bg-brand-surface-container-low p-6 rounded-2xl border border-brand-outline/10 w-full mb-8">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-brand-outline/10">
            <span className="font-label uppercase tracking-widest text-[0.85rem] text-brand-outline font-bold">Rounds</span>
            <span className="font-display text-[2rem] text-brand-on-surface leading-none">{currentRound ?? 1}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-label uppercase tracking-widest text-[0.85rem] text-brand-outline font-bold">Active Time</span>
            <span className="font-display text-[2rem] text-brand-on-surface leading-none tabular-nums">{formatTime(totalActiveTime)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-[1.4rem] mt-auto">
        <Button variant="secondary" className="!text-brand-primary !border-brand-primary/30 hover:!bg-brand-primary/10 hover:!border-brand-primary/80 hover:shadow-[0_0_15px_rgba(255,143,115,0.15)] transform hover:-translate-y-0.5 transition-all duration-300" onClick={onAddRound}>Add 1 More Round</Button>
        <Button variant="primary" onClick={() => onNavigate('home')}>Save & Finish</Button>
      </div>
    </div>
  );
}
