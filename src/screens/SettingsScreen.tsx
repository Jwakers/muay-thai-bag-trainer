import { useState } from "react";
import { Button } from "../components/Button";
import { InputField } from "../components/InputField";
import { COUNTDOWN_MAX_SECONDS } from "../data/countdownAudio";
import type { AppSettings, ScreenId } from "../types";

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function parseTime(timeStr: string): number {
  const parts = timeStr.split(":").map(Number);
  const m = parts[0] ?? 0;
  const s = parts[1] ?? 0;
  return m * 60 + s;
}

interface LocalSettingsForm {
  roundDuration: string;
  restDuration: string;
  totalRounds: string;
  preWorkoutCountdownSeconds: string;
  audibleCountdownLastSeconds: string;
  tenSecondWarning: boolean;
  calloutsEnabled: boolean;
  calloutsVolumePercent: number;
  calloutComboRepetitions: string;
  calloutRepeatPauseSeconds: string;
}

export interface SettingsScreenProps {
  onNavigate: (screen: ScreenId) => void;
  settings: AppSettings;
  onSaveSettings: (next: AppSettings) => void;
}

export function SettingsScreen({
  onNavigate,
  settings,
  onSaveSettings,
}: SettingsScreenProps) {
  const [localSettings, setLocalSettings] = useState<LocalSettingsForm>({
    roundDuration: formatTime(settings.roundDuration),
    restDuration: formatTime(settings.restDuration),
    totalRounds: settings.totalRounds.toString(),
    preWorkoutCountdownSeconds: settings.preWorkoutCountdownSeconds.toString(),
    audibleCountdownLastSeconds:
      settings.audibleCountdownLastSeconds.toString(),
    tenSecondWarning: settings.tenSecondWarning,
    calloutsEnabled: settings.calloutsEnabled,
    calloutsVolumePercent: Math.round(settings.calloutsVolume * 100),
    calloutComboRepetitions: settings.calloutComboRepetitions.toString(),
    calloutRepeatPauseSeconds: settings.calloutRepeatPauseSeconds.toString(),
  });

  const voiceControlsDisabled = !localSettings.calloutsEnabled;
  const volumeSliderDisabled =
    !localSettings.calloutsEnabled &&
    localSettings.audibleCountdownLastSeconds === "0";

  const handleCommit = () => {
    const totalRounds = parseInt(localSettings.totalRounds, 10);
    const preWorkout = parseInt(localSettings.preWorkoutCountdownSeconds, 10);
    const audibleLast = parseInt(localSettings.audibleCountdownLastSeconds, 10);
    const comboReps = parseInt(localSettings.calloutComboRepetitions, 10);
    const repeatPause = parseInt(localSettings.calloutRepeatPauseSeconds, 10);
    onSaveSettings({
      ...settings,
      roundDuration: parseTime(localSettings.roundDuration),
      restDuration: parseTime(localSettings.restDuration),
      totalRounds: Number.isFinite(totalRounds)
        ? totalRounds
        : settings.totalRounds,
      preWorkoutCountdownSeconds: Number.isFinite(preWorkout)
        ? Math.max(0, Math.min(120, preWorkout))
        : settings.preWorkoutCountdownSeconds,
      audibleCountdownLastSeconds: Number.isFinite(audibleLast)
        ? Math.max(0, Math.min(COUNTDOWN_MAX_SECONDS, audibleLast))
        : settings.audibleCountdownLastSeconds,
      tenSecondWarning: localSettings.tenSecondWarning,
      calloutsEnabled: localSettings.calloutsEnabled,
      calloutsVolume: Math.min(
        1,
        Math.max(0, localSettings.calloutsVolumePercent / 100),
      ),
      calloutComboRepetitions:
        Number.isFinite(comboReps) && comboReps >= 1 && comboReps <= 8
          ? comboReps
          : settings.calloutComboRepetitions,
      calloutRepeatPauseSeconds:
        Number.isFinite(repeatPause) && repeatPause >= 1 && repeatPause <= 120
          ? repeatPause
          : settings.calloutRepeatPauseSeconds,
    });
    onNavigate("home");
  };

  return (
    <div className="flex flex-col min-h-full p-8 bg-brand-background">
      <div className="mb-power">
        <h2 className="font-display text-brand-on-surface text-4xl md:text-5xl leading-none uppercase mb-standard">
          App Settings
        </h2>
      </div>

      <div className="flex flex-col flex-1">
        <div className="bg-brand-surface-container-low p-standard mb-8 border-l-8 border-l-brand-primary">
          <h3 className="font-display text-lg md:text-2xl uppercase mb-standard text-brand-primary tracking-tight">
            Intervals
          </h3>
          <InputField
            label="Round Duration (mm:ss)"
            value={localSettings.roundDuration}
            onChange={(e) =>
              setLocalSettings({
                ...localSettings,
                roundDuration: e.target.value,
              })
            }
          />
          <InputField
            label="Rest Duration (mm:ss)"
            value={localSettings.restDuration}
            onChange={(e) =>
              setLocalSettings({
                ...localSettings,
                restDuration: e.target.value,
              })
            }
          />
          <InputField
            label="Total Rounds"
            value={localSettings.totalRounds}
            onChange={(e) =>
              setLocalSettings({
                ...localSettings,
                totalRounds: e.target.value,
              })
            }
          />
          <InputField
            id="pre-workout-countdown"
            label={
              <>
                <span className="block">Pre-workout countdown</span>
                <span className="block normal-case mt-1 text-xs font-body tracking-normal text-brand-outline">
                  Before round 1 only. 0 = skip, max 120.
                </span>
              </>
            }
            value={localSettings.preWorkoutCountdownSeconds}
            onChange={(e) =>
              setLocalSettings({
                ...localSettings,
                preWorkoutCountdownSeconds: e.target.value,
              })
            }
            inputMode="numeric"
          />
        </div>

        <div className="bg-brand-surface-container-low p-standard mb-8 border-l-8 border-l-brand-secondary">
          <h3 className="font-display text-lg md:text-2xl uppercase mb-standard text-brand-secondary tracking-tight">
            Countdown warnings
          </h3>
          <InputField
            id="audible-countdown-last-seconds"
            label={
              <>
                <span className="block">Countdown audio (last N seconds)</span>
                <span className="block normal-case mt-1 text-xs font-body tracking-normal text-brand-outline">
                  Plays before prep ends, rest ends, and each round ends. 0 =
                  off, max {COUNTDOWN_MAX_SECONDS}. Uses callout volume.
                </span>
              </>
            }
            value={localSettings.audibleCountdownLastSeconds}
            onChange={(e) =>
              setLocalSettings({
                ...localSettings,
                audibleCountdownLastSeconds: e.target.value,
              })
            }
            inputMode="numeric"
          />
          <label className="flex items-start justify-between gap-4 py-2 cursor-pointer">
            <span className="flex flex-col gap-1 pr-2">
              <span className="font-label uppercase text-sm font-bold tracking-widest text-brand-on-surface">
                Visual warning (last 10s of round)
              </span>
              <span className="font-body text-xs normal-case text-brand-outline leading-snug">
                Pulsing red timer during the active round only.
              </span>
            </span>
            <input
              type="checkbox"
              checked={localSettings.tenSecondWarning}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  tenSecondWarning: e.target.checked,
                })
              }
              className="w-5 h-5 accent-brand-secondary cursor-pointer shrink-0 mt-1"
            />
          </label>
        </div>

        <div className="bg-brand-surface-container-low p-standard mb-8 border-l-8 border-l-brand-tertiary">
          <h3 className="font-display text-lg md:text-2xl uppercase mb-standard text-brand-tertiary tracking-tight">
            Callouts
          </h3>
          <label className="flex items-center justify-between py-2 cursor-pointer mb-4">
            <span className="font-label uppercase text-sm font-bold tracking-widest text-brand-on-surface">
              Voice callouts
            </span>
            <input
              type="checkbox"
              checked={localSettings.calloutsEnabled}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  calloutsEnabled: e.target.checked,
                })
              }
              className="w-5 h-5 accent-brand-tertiary cursor-pointer"
            />
          </label>
          <div className={volumeSliderDisabled ? "opacity-40" : ""}>
            <label
              htmlFor="callouts-volume"
              className={`font-label uppercase text-sm font-bold tracking-widest text-brand-on-surface block mb-2 ${
                volumeSliderDisabled ? "cursor-not-allowed" : ""
              }`}
            >
              Callout volume ({localSettings.calloutsVolumePercent}%)
              <span className="block normal-case mt-1 text-xs font-body tracking-normal text-brand-outline">
                Also controls countdown audio.
              </span>
            </label>
            <input
              id="callouts-volume"
              type="range"
              min={0}
              max={100}
              value={localSettings.calloutsVolumePercent}
              disabled={volumeSliderDisabled}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  calloutsVolumePercent: Number(e.target.value),
                })
              }
              className={`w-full accent-brand-tertiary ${volumeSliderDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
            />
            <InputField
              id="callout-combo-repetitions"
              disabled={voiceControlsDisabled}
              label="Combo repetition (times per round, 1–8)"
              value={localSettings.calloutComboRepetitions}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  calloutComboRepetitions: e.target.value,
                })
              }
              inputMode="numeric"
            />
            <InputField
              id="callout-repeat-pause"
              disabled={voiceControlsDisabled}
              label="Pause between repetitions (seconds, 1–120)"
              value={localSettings.calloutRepeatPauseSeconds}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  calloutRepeatPauseSeconds: e.target.value,
                })
              }
              inputMode="numeric"
            />
          </div>
        </div>
      </div>

      <div className="mt-auto pt-power flex flex-col gap-standard">
        <Button variant="primary" onClick={handleCommit}>
          Save Settings
        </Button>
        <Button variant="secondary" onClick={() => onNavigate("home")}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
