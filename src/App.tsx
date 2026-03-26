import { useEffect, useState } from 'react';
import { COUNTDOWN_MAX_SECONDS } from './data/countdownAudio';
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
    return {
      roundDuration: typeof o.roundDuration === 'number' ? o.roundDuration : DEFAULT_SETTINGS.roundDuration,
      restDuration: typeof o.restDuration === 'number' ? o.restDuration : DEFAULT_SETTINGS.restDuration,
      totalRounds: typeof o.totalRounds === 'number' ? o.totalRounds : DEFAULT_SETTINGS.totalRounds,
      preWorkoutCountdownSeconds:
        typeof o.preWorkoutCountdownSeconds === 'number' &&
        o.preWorkoutCountdownSeconds >= 0 &&
        o.preWorkoutCountdownSeconds <= 120
          ? Math.floor(o.preWorkoutCountdownSeconds)
          : DEFAULT_SETTINGS.preWorkoutCountdownSeconds,
      tenSecondWarning:
        typeof o.tenSecondWarning === 'boolean' ? o.tenSecondWarning : DEFAULT_SETTINGS.tenSecondWarning,
      difficulty: isDifficulty(o.difficulty) ? o.difficulty : DEFAULT_SETTINGS.difficulty,
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

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn(e);
    }
  }, [settings]);

  const [currentRound, setCurrentRound] = useState(1);

  return (
    <div className="min-h-screen bg-brand-background text-brand-on-surface flex items-center justify-center">
      <div className="w-full max-w-md h-full min-h-screen bg-brand-background shadow-2xl relative overflow-hidden flex flex-col">
        {currentScreen === 'home' ? (
          <HomeScreen
            onNavigate={setCurrentScreen}
            pwaInstall={pwaInstall}
            onStartTraining={() => {
              setCurrentRound(1);
              setCurrentScreen('difficulty');
            }}
          />
        ) : null}
        {currentScreen === 'difficulty' ? (
          <DifficultyScreen
            onNavigate={setCurrentScreen}
            onSelectDifficulty={(diff) => {
              setSettings((s) => ({ ...s, difficulty: diff }));
              setCurrentScreen('active');
            }}
          />
        ) : null}
        {currentScreen === 'active' ? (
          <ActiveTrainingScreen onNavigate={setCurrentScreen} settings={settings} currentRound={currentRound} />
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
          <SettingsScreen onNavigate={setCurrentScreen} settings={settings} onSaveSettings={setSettings} />
        ) : null}
        {currentScreen === 'complete' ? (
          <WorkoutCompleteScreen
            onNavigate={setCurrentScreen}
            settings={settings}
            currentRound={currentRound}
            onAddRound={() => {
              setSettings((s) => ({ ...s, totalRounds: s.totalRounds + 1 }));
              setCurrentRound((r) => r + 1);
              setCurrentScreen('active');
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

export default App;
