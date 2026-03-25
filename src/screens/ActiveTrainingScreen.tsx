import { SkipForward } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../components/Button";
import { PulseTimer } from "../components/PulseTimer";
import { WorkoutCard } from "../components/WorkoutCard";
import { getRandomCombos } from "../data/workoutData";
import { useComboCallouts } from "../hooks/useComboCallouts";
import { useScreenWakeLock } from "../hooks/useScreenWakeLock";
import { useTimer } from "../hooks/useTimer";
import type { AppSettings, ScreenId } from "../types";

export interface ActiveTrainingScreenProps {
  onNavigate: (screen: ScreenId) => void;
  settings: AppSettings;
  currentRound: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function ActiveTrainingScreen({
  onNavigate,
  settings,
  currentRound,
}: ActiveTrainingScreenProps) {
  useScreenWakeLock();
  const [currentCombos] = useState(() =>
    getRandomCombos(1, settings.difficulty),
  );
  const timeLeft = useTimer(settings.roundDuration);

  useComboCallouts(
    currentCombos[0]?.calloutIds,
    settings.calloutsEnabled,
    settings.calloutsVolume,
    settings.calloutComboRepetitions,
    settings.calloutRepeatPauseSeconds,
  );

  const handleRoundComplete = useCallback(() => {
    if (currentRound < settings.totalRounds) {
      onNavigate("rest");
    } else {
      onNavigate("complete");
    }
  }, [currentRound, settings.totalRounds, onNavigate]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleRoundComplete();
    }
  }, [timeLeft, handleRoundComplete]);

  const isWarning = settings.tenSecondWarning && timeLeft <= 10 && timeLeft > 0;
  const isFinalRound = currentRound >= settings.totalRounds;

  return (
    <div className="flex flex-col min-h-screen p-8 bg-brand-background">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-display text-brand-primary text-8 leading-none uppercase">
          {isFinalRound ? "Final Round" : `Round ${currentRound}`}
        </h2>
        <button
          type="button"
          onClick={handleRoundComplete}
          className="font-label text-brand-outline hover:text-brand-primary font-bold uppercase tracking-widest text-[0.75rem] transition-colors cursor-pointer flex items-center gap-2"
        >
          Skip Round{" "}
          <SkipForward
            className="size-[1.2rem] shrink-0"
            aria-hidden
            strokeWidth={2.5}
          />
        </button>
      </div>
      <div className="flex-1 flex flex-col">
        <PulseTimer time={formatTime(timeLeft)} pulsing warning={isWarning} />

        <div className="mt-[2.75rem] overflow-y-auto max-h-[40vh] pb-4">
          {currentCombos.map((combo, i) => (
            <WorkoutCard key={i} {...combo} />
          ))}
        </div>
      </div>
      <div className="mt-auto pt-[2.75rem]">
        <Button
          variant="secondary"
          className="w-full text-brand-error border-brand-error/30 hover:bg-brand-error/10 hover:text-brand-error active:bg-brand-error/20"
          onClick={() => onNavigate("home")}
        >
          End Workout
        </Button>
      </div>
    </div>
  );
}
