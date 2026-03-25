import { useState } from "react";
import { Button } from "../components/Button";
import { InputField } from "../components/InputField";
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
    tenSecondWarning: settings.tenSecondWarning,
    calloutsEnabled: settings.calloutsEnabled,
    calloutsVolumePercent: Math.round(settings.calloutsVolume * 100),
    calloutComboRepetitions: settings.calloutComboRepetitions.toString(),
    calloutRepeatPauseSeconds: settings.calloutRepeatPauseSeconds.toString(),
  });

  const voiceControlsDisabled = !localSettings.calloutsEnabled;

  const handleCommit = () => {
    const totalRounds = parseInt(localSettings.totalRounds, 10);
    const comboReps = parseInt(localSettings.calloutComboRepetitions, 10);
    const repeatPause = parseInt(localSettings.calloutRepeatPauseSeconds, 10);
    onSaveSettings({
      ...settings,
      roundDuration: parseTime(localSettings.roundDuration),
      restDuration: parseTime(localSettings.restDuration),
      totalRounds: Number.isFinite(totalRounds)
        ? totalRounds
        : settings.totalRounds,
      tenSecondWarning: localSettings.tenSecondWarning,
      calloutsEnabled: localSettings.calloutsEnabled,
      calloutsVolume: Math.min(1, Math.max(0, localSettings.calloutsVolumePercent / 100)),
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
    <div className="flex flex-col min-h-screen p-8 bg-brand-background">
      <div className="mb-[2.75rem]">
        <h2 className="font-display text-brand-on-surface text-8 md:text-[3rem] leading-none uppercase mb-[1.4rem]">
          App Settings
        </h2>
      </div>

      <div className="flex flex-col flex-1">
        <div className="bg-brand-surface-container-low p-[1.4rem] mb-8 border-l-[8px] border-l-brand-primary">
          <h3 className="font-display text-[1.2rem] md:text-[1.5rem] uppercase mb-[1.4rem] text-brand-primary tracking-tight">
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
        </div>

        <div className="bg-brand-surface-container-low p-[1.4rem] mb-8 border-l-[8px] border-l-brand-secondary">
          <h3 className="font-display text-[1.2rem] md:text-[1.5rem] uppercase mb-[1.4rem] text-brand-secondary tracking-tight">
            Alerts
          </h3>
          <label className="flex items-center justify-between py-2 cursor-pointer">
            <span className="font-label uppercase text-[0.8rem] md:text-[0.9rem] font-bold tracking-widest text-brand-on-surface">
              10-Second Warning
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
              className="w-5 h-5 accent-brand-secondary cursor-pointer"
            />
          </label>
        </div>

        <div className="bg-brand-surface-container-low p-[1.4rem] mb-8 border-l-[8px] border-l-brand-tertiary">
          <h3 className="font-display text-[1.2rem] md:text-[1.5rem] uppercase mb-[1.4rem] text-brand-tertiary tracking-tight">
            Callouts
          </h3>
          <label className="flex items-center justify-between py-2 cursor-pointer mb-4">
            <span className="font-label uppercase text-[0.8rem] md:text-[0.9rem] font-bold tracking-widest text-brand-on-surface">
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
          <div className={voiceControlsDisabled ? "opacity-40" : ""}>
            <label
              htmlFor="callouts-volume"
              className={`font-label uppercase text-[0.8rem] md:text-[0.9rem] font-bold tracking-widest text-brand-on-surface block mb-2 ${
                voiceControlsDisabled ? "cursor-not-allowed" : ""
              }`}
            >
              Callout volume ({localSettings.calloutsVolumePercent}%)
            </label>
            <input
              id="callouts-volume"
              type="range"
              min={0}
              max={100}
              value={localSettings.calloutsVolumePercent}
              disabled={voiceControlsDisabled}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  calloutsVolumePercent: Number(e.target.value),
                })
              }
              className={`w-full accent-brand-tertiary ${voiceControlsDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
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

      <div className="mt-auto pt-[2.75rem] flex flex-col gap-[1.4rem]">
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
