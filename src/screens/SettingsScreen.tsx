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
  });

  const handleCommit = () => {
    const totalRounds = parseInt(localSettings.totalRounds, 10);
    onSaveSettings({
      ...settings,
      roundDuration: parseTime(localSettings.roundDuration),
      restDuration: parseTime(localSettings.restDuration),
      totalRounds: Number.isFinite(totalRounds)
        ? totalRounds
        : settings.totalRounds,
      tenSecondWarning: localSettings.tenSecondWarning,
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
