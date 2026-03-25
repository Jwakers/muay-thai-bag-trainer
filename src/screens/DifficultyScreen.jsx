import React from 'react';
import { Button } from '../components/Button';

export function DifficultyScreen({ onNavigate, onSelectDifficulty }) {
  return (
    <div className="flex flex-col min-h-screen p-[2rem] bg-brand-background">
      <div className="mb-[2.75rem]">
        <h2 className="font-display text-brand-on-surface text-[2rem] md:text-[3rem] leading-none uppercase mb-[1.4rem]">Select Intensity</h2>
        <p className="font-body text-brand-outline text-[1.1rem]">Choose your combination complexity for this session.</p>
      </div>
      
      <div className="flex flex-col flex-1 gap-4 justify-center">
        <button 
          onClick={() => onSelectDifficulty('beginner')}
          className="bg-brand-surface-container-low hover:bg-white/5 active:bg-white/10 border-l-[8px] border-l-[#a8e6cf] p-6 text-left transition-colors cursor-pointer group"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-display text-[1.5rem] uppercase text-brand-on-surface group-hover:text-[#a8e6cf] transition-colors">Beginner</h3>
            <span className="text-[#a8e6cf] text-xl opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </div>
          <p className="font-body text-brand-outline mt-2 text-[0.9rem]">Fundamentals. 2-3 strikes with simple rhythm.</p>
        </button>

        <button 
          onClick={() => onSelectDifficulty('intermediate')}
          className="bg-brand-surface-container-low hover:bg-white/5 active:bg-white/10 border-l-[8px] border-l-brand-primary p-6 text-left transition-colors cursor-pointer group"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-display text-[1.5rem] uppercase text-brand-on-surface group-hover:text-brand-primary transition-colors">Intermediate</h3>
            <span className="text-brand-primary text-xl opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </div>
          <p className="font-body text-brand-outline mt-2 text-[0.9rem]">Level changing. 4-5 strikes and basic counters.</p>
        </button>

        <button 
          onClick={() => onSelectDifficulty('advanced')}
          className="bg-brand-surface-container-low hover:bg-white/5 active:bg-white/10 border-l-[8px] border-l-brand-error p-6 text-left transition-colors cursor-pointer group"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-display text-[1.5rem] uppercase text-brand-on-surface group-hover:text-brand-error transition-colors">Advanced</h3>
            <span className="text-brand-error text-xl opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </div>
          <p className="font-body text-brand-outline mt-2 text-[0.9rem]">Complex flow. Elbows, specific feints, and heavy momentum.</p>
        </button>

        <button 
          onClick={() => onSelectDifficulty('mixed')}
          className="bg-brand-surface-container-low hover:bg-white/5 active:bg-white/10 border-l-[8px] border-l-brand-tertiary p-6 text-left transition-colors cursor-pointer group"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-display text-[1.5rem] uppercase text-brand-on-surface group-hover:text-brand-tertiary transition-colors">Mixed</h3>
            <span className="text-brand-tertiary text-xl opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </div>
          <p className="font-body text-brand-outline mt-2 text-[0.9rem]">Diverse training. A completely open mix of all difficulties.</p>
        </button>
      </div>

      <div className="mt-auto pt-[2.75rem]">
        <Button variant="secondary" className="w-full" onClick={() => onNavigate('home')}>Go Back</Button>
      </div>
    </div>
  );
}
