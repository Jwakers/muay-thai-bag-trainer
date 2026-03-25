import React from 'react';
import { Button } from '../components/Button';

export function HomeScreen({ onNavigate, onStartTraining }) {
  return (
    <div className="flex flex-col min-h-screen p-[2rem]">
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="font-display text-[3.5rem] md:text-[5rem] tracking-tight leading-[1.1] mb-4">
          THE<br/>KINETIC<br/><span className="text-brand-primary drop-shadow-[0_0_10px_rgba(255,143,115,0.4)]">ARENA</span>
        </h1>
        <p className="font-body text-brand-outline text-[1.2rem] mb-[2.75rem]">High-Octane Muay Thai Bag Trainer</p>
      </div>
      
      <div className="flex flex-col gap-[1.4rem] mt-auto">
        <Button variant="primary" onClick={() => onStartTraining ? onStartTraining() : onNavigate('active')}>Start Training</Button>
        <Button variant="secondary" onClick={() => onNavigate('settings')}>App Settings</Button>
      </div>
    </div>
  );
}
