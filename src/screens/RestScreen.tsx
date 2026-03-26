import { useEffect } from "react";
import { Button } from "../components/Button";
import { useAudibleCountdownWav } from "../hooks/useAudibleCountdownWav";
import { useScreenWakeLock } from "../hooks/useScreenWakeLock";
import { useTimer } from "../hooks/useTimer";
import type { AppSettings, ScreenId } from "../types";

export interface RestScreenProps {
  onNavigate: (screen: ScreenId) => void;
  settings: AppSettings;
  onNextRound?: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function RestScreen({
  onNavigate,
  settings,
  onNextRound,
}: RestScreenProps) {
  useScreenWakeLock();
  const timeLeft = useTimer(settings.restDuration);

  useAudibleCountdownWav(
    timeLeft,
    settings.audibleCountdownLastSeconds,
    settings.calloutsVolume,
  );

  useEffect(() => {
    if (timeLeft === 0) {
      if (onNextRound) onNextRound();
      else onNavigate("active");
    }
  }, [timeLeft, onNavigate, onNextRound]);

  return (
    <div className="flex flex-col min-h-full p-8 bg-brand-background border-t-8 border-t-brand-tertiary">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-display text-brand-tertiary text-4xl md:text-5xl leading-none uppercase">
          Rest
        </h2>
        <div className="font-label text-brand-outline font-bold uppercase tracking-widest text-xs">
          Recovery
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="font-display text-brand-on-surface text-8xl md:text-9xl tabular-nums tracking-tighter leading-none text-center drop-shadow-[0_0_15px_rgba(233,170,255,0.2)]">
          {formatTime(timeLeft)}
        </div>
        <p className="font-body text-brand-outline text-center mt-6 text-lg max-w-xs mx-auto">
          Heart rate recovery phase.
        </p>
      </div>

      <div className="mt-auto flex flex-col gap-standard">
        <Button
          variant="primary"
          className="!bg-gradient-to-r !from-brand-tertiary !to-brand-tertiary-fixed-dim !text-brand-on-tertiary"
          onClick={() => (onNextRound ? onNextRound() : onNavigate("active"))}
        >
          Skip Rest
        </Button>
        <Button
          variant="secondary"
          className="text-brand-error border-brand-error/30 hover:bg-brand-error/10 hover:text-brand-error active:bg-brand-error/20"
          onClick={() => onNavigate("home")}
        >
          End Workout
        </Button>
      </div>
    </div>
  );
}
