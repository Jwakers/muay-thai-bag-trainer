import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { PulseTimer } from '../components/PulseTimer';
import { WorkoutCard } from '../components/WorkoutCard';
import { getRandomCombos } from '../data/workoutData';
import { useTimer } from '../hooks/useTimer';

export function ActiveTrainingScreen({ onNavigate, settings, currentRound }) {
  const [currentCombos] = useState(() => getRandomCombos(1, settings?.difficulty ?? 'beginner'));
  const timeLeft = useTimer(settings?.roundDuration ?? 60); // Default to 1 min
  
  const handleRoundComplete = () => {
    if ((currentRound ?? 1) < (settings?.totalRounds ?? 5)) {
      onNavigate('rest');
    } else {
      onNavigate('complete');
    }
  };

  // Navigate upon completion
  useEffect(() => {
    if (timeLeft === 0) {
      handleRoundComplete();
    }
  }, [timeLeft, currentRound, settings, onNavigate]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isWarning = settings?.tenSecondWarning && timeLeft <= 10 && timeLeft > 0;
  const isFinalRound = (currentRound ?? 1) >= (settings?.totalRounds ?? 5);

  return (
    <div className="flex flex-col min-h-screen p-[2rem] bg-brand-background">
      <div className="flex justify-between items-center mb-[2rem]">
        <h2 className="font-display text-brand-primary text-[2rem] leading-none uppercase">{isFinalRound ? 'Final Round' : `Round ${currentRound ?? 1}`}</h2>
        <button 
          onClick={handleRoundComplete}
          className="font-label text-brand-outline hover:text-brand-primary font-bold uppercase tracking-widest text-[0.75rem] transition-colors cursor-pointer flex items-center gap-2"
        >
          Skip Round <span className="text-[1.2rem] leading-none">⏭</span>
        </button>
      </div>
      
      <div className="flex-1 flex flex-col">
        <PulseTimer time={formatTime(timeLeft)} pulsing={true} warning={isWarning} />
        
        <div className="mt-[2.75rem] overflow-y-auto max-h-[40vh] pb-4">
          {currentCombos.map((combo, i) => (
            <WorkoutCard key={i} {...combo} />
          ))}
        </div>
      </div>

      <div className="mt-auto pt-[2.75rem]">
        <Button variant="secondary" className="w-full text-brand-error border-brand-error/30 hover:bg-brand-error/10 hover:text-brand-error active:bg-brand-error/20" onClick={() => onNavigate('home')}>End Workout</Button>
      </div>
    </div>
  );
}
