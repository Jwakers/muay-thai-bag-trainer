import { useEffect, useState } from 'react';
import { COUNTDOWN_MAX_SECONDS } from './data/countdownAudio';
import {
  createWorkoutPlan,
  getMaxRoundsForDifficulty,
} from './data/workoutData';
import { usePwaInstall } from './hooks/usePwaInstall';
import type { AppSettings, Difficulty, ScreenId } from './types';
import { ActiveTrainingScreen } from './screens/ActiveTrainingScreen';
import { DifficultyScreen } from './screens/DifficultyScreen';
import { HomeScreen } from './screens/HomeScreen';
import { RestScreen } from './screens/RestScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { WorkoutCompleteScreen } from './screens/WorkoutCompleteScreen';

const SETTINGS_KEY = 'thaimerSettings';

const DEFAULT_SETTINGS: AppSettings = {
  roundDuration: 60,
  restDuration: 30,
  totalRounds: 5,
  preWorkoutCountdownSeconds: COUNTDOWN_MAX_SECONDS,
  audibleCountdownLastSeconds: COUNTDOWN_MAX_SECONDS,
  tenSecondWarning: true,
  difficulty: 'beginner',
  calloutsEnabled: true,
  calloutsVolume: 1,
  calloutComboRepetitions: 3,
  calloutRepeatPauseSeconds: 5,
};

function isDifficulty(value: unknown): value is Difficulty {
  return value === 'beginner' || value === 'intermediate' || value === 'advanced' || value === 'mixed';
}

function loadSettings(): AppSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (!saved) return DEFAULT_SETTINGS;
    const parsed: unknown = JSON.parse(saved);
    if (parsed === null || typeof parsed !== 'object') return DEFAULT_SETTINGS;
    const o = parsed as Record<string, unknown>;
    const difficulty = isDifficulty(o.difficulty)
      ? o.difficulty
      : DEFAULT_SETTINGS.difficulty;
    const maxRounds = getMaxRoundsForDifficulty(difficulty);
    return {
      roundDuration: typeof o.roundDuration === 'number' ? o.roundDuration : DEFAULT_SETTINGS.roundDuration,
      restDuration: typeof o.restDuration === 'number' ? o.restDuration : DEFAULT_SETTINGS.restDuration,
      totalRounds:
        typeof o.totalRounds === 'number'
          ? Math.max(1, Math.min(maxRounds, Math.floor(o.totalRounds)))
          : DEFAULT_SETTINGS.totalRounds,
      preWorkoutCountdownSeconds:
        typeof o.preWorkoutCountdownSeconds === 'number' &&
        o.preWorkoutCountdownSeconds >= 0 &&
        o.preWorkoutCountdownSeconds <= 120
          ? Math.floor(o.preWorkoutCountdownSeconds)
          : DEFAULT_SETTINGS.preWorkoutCountdownSeconds,
      tenSecondWarning:
        typeof o.tenSecondWarning === 'boolean' ? o.tenSecondWarning : DEFAULT_SETTINGS.tenSecondWarning,
      difficulty,
      calloutsEnabled:
        typeof o.calloutsEnabled === 'boolean' ? o.calloutsEnabled : DEFAULT_SETTINGS.calloutsEnabled,
      calloutsVolume:
        typeof o.calloutsVolume === 'number' &&
        o.calloutsVolume >= 0 &&
        o.calloutsVolume <= 1
          ? o.calloutsVolume
          : DEFAULT_SETTINGS.calloutsVolume,
      calloutComboRepetitions:
        typeof o.calloutComboRepetitions === 'number' &&
        o.calloutComboRepetitions >= 1 &&
        o.calloutComboRepetitions <= 8
          ? Math.floor(o.calloutComboRepetitions)
          : DEFAULT_SETTINGS.calloutComboRepetitions,
      calloutRepeatPauseSeconds:
        typeof o.calloutRepeatPauseSeconds === 'number' &&
        o.calloutRepeatPauseSeconds >= 1 &&
        o.calloutRepeatPauseSeconds <= 120
          ? Math.floor(o.calloutRepeatPauseSeconds)
          : DEFAULT_SETTINGS.calloutRepeatPauseSeconds,
      audibleCountdownLastSeconds:
        typeof o.audibleCountdownLastSeconds === 'number' &&
        Number.isFinite(o.audibleCountdownLastSeconds)
          ? Math.min(
              COUNTDOWN_MAX_SECONDS,
              Math.max(0, Math.floor(o.audibleCountdownLastSeconds)),
            )
          : DEFAULT_SETTINGS.audibleCountdownLastSeconds,
    };
  } catch (e) {
    console.warn(e);
    return DEFAULT_SETTINGS;
  }
}

function App() {
  const pwaInstall = usePwaInstall();
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [workoutPlan, setWorkoutPlan] = useState(() =>
    createWorkoutPlan(settings.totalRounds, settings.difficulty),
  );

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn(e);
    }
  }, [settings]);

  const [currentRound, setCurrentRound] = useState(1);
  const activeCombo = workoutPlan[currentRound - 1];

  return (
    <div className="min-h-dvh bg-brand-background text-brand-on-surface flex items-stretch justify-center pt-[env(safe-area-inset-top)] pb-[max(env(safe-area-inset-bottom),1rem)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      <div className="w-full max-w-md min-h-full bg-brand-background shadow-2xl relative overflow-hidden flex flex-col">
        <div className="bg-brand-secondary text-brand-background text-center font-label text-xs tracking-widest px-standard py-micro">
          BUILD {__BUILD_TIME__}
        </div>
        {currentScreen === 'home' ? (
          <HomeScreen
            onNavigate={setCurrentScreen}
            pwaInstall={pwaInstall}
            onStartTraining={() => {
              const rounds = Math.max(
                1,
                Math.min(settings.totalRounds, getMaxRoundsForDifficulty(settings.difficulty)),
              );
              setWorkoutPlan(createWorkoutPlan(rounds, settings.difficulty));
              setCurrentRound(1);
              setCurrentScreen('difficulty');
            }}
          />
        ) : null}
        {currentScreen === 'difficulty' ? (
          <DifficultyScreen
            onNavigate={setCurrentScreen}
            onSelectDifficulty={(diff) => {
              const rounds = Math.max(
                1,
                Math.min(settings.totalRounds, getMaxRoundsForDifficulty(diff)),
              );
              setSettings((s) => ({
                ...s,
                difficulty: diff,
                totalRounds: rounds,
              }));
              setWorkoutPlan(createWorkoutPlan(rounds, diff));
              setCurrentRound(1);
              setCurrentScreen('active');
            }}
          />
        ) : null}
        {currentScreen === 'active' ? (
          <ActiveTrainingScreen
            onNavigate={setCurrentScreen}
            settings={settings}
            currentRound={currentRound}
            combo={activeCombo}
          />
        ) : null}
        {currentScreen === 'rest' ? (
          <RestScreen
            onNavigate={setCurrentScreen}
            settings={settings}
            onNextRound={() => {
              setCurrentRound((r) => r + 1);
              setCurrentScreen('active');
            }}
          />
        ) : null}
        {currentScreen === 'settings' ? (
          <SettingsScreen
            onNavigate={setCurrentScreen}
            settings={settings}
            onSaveSettings={setSettings}
            pwaInstall={pwaInstall}
          />
        ) : null}
        {currentScreen === 'complete' ? (
          <WorkoutCompleteScreen
            onNavigate={setCurrentScreen}
            settings={settings}
            currentRound={currentRound}
            canAddRound={settings.totalRounds < getMaxRoundsForDifficulty(settings.difficulty)}
            onAddRound={() => {
              setSettings((s) => {
                const max = getMaxRoundsForDifficulty(s.difficulty);
                if (s.totalRounds >= max) return s;
                setWorkoutPlan((prev) => {
                  const extra = createWorkoutPlan(1, s.difficulty, prev);
                  if (extra.length === 0) return prev;
                  setCurrentRound((r) => r + 1);
                  setCurrentScreen('active');
                  return [...prev, extra[0]];
                });
                return { ...s, totalRounds: Math.min(max, s.totalRounds + 1) };
              });
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

export default App;
