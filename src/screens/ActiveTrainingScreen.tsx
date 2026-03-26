import { SkipForward } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../components/Button";
import { PulseTimer } from "../components/PulseTimer";
import { WorkoutCard } from "../components/WorkoutCard";
import { getRandomCombos } from "../data/workoutData";
import { useAudibleCountdownWav } from "../hooks/useAudibleCountdownWav";
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
  const activeCombo = currentCombos[0];

  const needsPreWorkoutPrep =
    currentRound === 1 && settings.preWorkoutCountdownSeconds > 0;

  const [workoutRoundStarted, setWorkoutRoundStarted] = useState(
    () => !needsPreWorkoutPrep,
  );

  const [prepSecondsLeft, setPrepSecondsLeft] = useState(() =>
    needsPreWorkoutPrep ? settings.preWorkoutCountdownSeconds : 0,
  );

  useEffect(() => {
    if (workoutRoundStarted || !needsPreWorkoutPrep) return;
    const timer = setInterval(() => {
      setPrepSecondsLeft((t) => {
        if (t <= 0) return 0;
        if (t === 1) {
          queueMicrotask(() => setWorkoutRoundStarted(true));
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [workoutRoundStarted, needsPreWorkoutPrep]);

  const timeLeft = useTimer(settings.roundDuration, workoutRoundStarted);

  const inPrep = needsPreWorkoutPrep && !workoutRoundStarted;
  const countdownSecondsForSpeech = inPrep
    ? prepSecondsLeft
    : workoutRoundStarted
      ? timeLeft
      : 0;

  useAudibleCountdownWav(
    countdownSecondsForSpeech,
    settings.audibleCountdownLastSeconds,
    settings.calloutsVolume,
  );

  useComboCallouts(
    activeCombo?.calloutIds,
    settings.calloutsEnabled && workoutRoundStarted,
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

  const isWarning =
    !inPrep && settings.tenSecondWarning && timeLeft <= 10 && timeLeft > 0;
  const isFinalRound = currentRound >= settings.totalRounds;

  return (
    <div className="flex flex-col min-h-full p-8 bg-brand-background">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-display text-brand-primary text-4xl md:text-5xl leading-none uppercase">
          {isFinalRound ? "Final Round" : `Round ${currentRound}`}
        </h2>
        <button
          type="button"
          onClick={handleRoundComplete}
          className="font-label text-brand-outline hover:text-brand-primary font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer flex items-center gap-2"
        >
          Skip Round{" "}
          <SkipForward
            className="size-5 shrink-0"
            aria-hidden
            strokeWidth={2.5}
          />
        </button>
      </div>
      <div className="flex-1 flex flex-col">
        {inPrep ? (
          <>
            <div className="relative flex flex-col items-center justify-center py-power my-power">
              <div
                aria-live="polite"
                className="font-display text-brand-on-surface text-8xl md:text-9xl tabular-nums tracking-tighter leading-none text-center"
              >
                {prepSecondsLeft}
              </div>
              <p className="font-body text-brand-outline text-center mt-6 text-lg max-w-xs mx-auto">
                Get ready
              </p>
            </div>
            <Button
              variant="primary"
              className="w-full mb-power"
              onClick={() => setWorkoutRoundStarted(true)}
            >
              Start now
            </Button>
          </>
        ) : (
          <PulseTimer time={formatTime(timeLeft)} pulsing warning={isWarning} />
        )}

        <div
          className={`overflow-y-auto max-h-[40vh] pb-4 ${inPrep ? "" : "mt-power"}`}
        >
          {currentCombos.map((combo, i) => (
            <WorkoutCard key={i} {...combo} />
          ))}
          {settings.calloutsEnabled && !activeCombo?.calloutIds?.length ? (
            <p
              role="status"
              className="font-body text-brand-outline text-center text-sm mt-4 max-w-sm mx-auto"
            >
              Voice callouts are not set up for this intensity yet. Use beginner
              for spoken combos, or turn off voice callouts in settings.
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-auto pt-power">
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
