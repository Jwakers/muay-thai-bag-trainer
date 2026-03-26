import type { CalloutId } from "./data/callouts";

export type ScreenId =
  | "home"
  | "difficulty"
  | "active"
  | "rest"
  | "settings"
  | "complete";

export type Difficulty = "beginner" | "intermediate" | "advanced" | "mixed";

export interface AppSettings {
  roundDuration: number;
  restDuration: number;
  totalRounds: number;
  /** Countdown before round 1 only; 0 = off. */
  preWorkoutCountdownSeconds: number;
  /**
   * Bundled WAV countdown for the last N seconds (max 10); prep, rest, and each round. 0 = off.
   */
  audibleCountdownLastSeconds: number;
  tenSecondWarning: boolean;
  difficulty: Difficulty;
  /** Voice callouts during active rounds (beginner combos with calloutIds). */
  calloutsEnabled: boolean;
  /** Linear gain 0–1 applied to decoded callout buffers. */
  calloutsVolume: number;
  /** How many times to read the full combo per round (each pass = full move sequence). */
  calloutComboRepetitions: number;
  /** Seconds of silence after each full combo before the next repeat (not after the last). */
  calloutRepeatPauseSeconds: number;
}

export interface WorkoutCombo {
  title: string;
  subtitle: string;
  active?: boolean;
  setsReps?: string;
  /** Ordered move ids for audio; omit when no bundled clips exist yet. */
  calloutIds?: readonly CalloutId[];
}
