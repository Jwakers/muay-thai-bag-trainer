export type ScreenId =
  | 'home'
  | 'difficulty'
  | 'active'
  | 'rest'
  | 'settings'
  | 'complete';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'mixed';

export interface AppSettings {
  roundDuration: number;
  restDuration: number;
  totalRounds: number;
  tenSecondWarning: boolean;
  difficulty: Difficulty;
}

export interface WorkoutCombo {
  title: string;
  subtitle: string;
  active?: boolean;
  setsReps?: string;
}
