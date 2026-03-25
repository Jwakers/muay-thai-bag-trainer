import type { WorkoutCombo } from "../types";

export interface WorkoutCardProps extends WorkoutCombo {
  className?: string;
}

export function WorkoutCard({
  title,
  subtitle,
  setsReps,
  active = false,
  className = "",
}: WorkoutCardProps) {
  return (
    <div
      className={`flex items-center justify-between p-8 bg-brand-surface-container-highest mb-8 transition-colors ${active ? "ring-2 ring-brand-primary !bg-brand-surface-bright" : ""} ${className}`}
    >
      <div className="flex flex-col text-left pr-4">
        <h3 className="font-display text-[1.5rem] md:text-8 text-brand-on-surface uppercase leading-tight tracking-tight">
          {title}
        </h3>
        {subtitle ? (
          <span className="font-body text-[1rem] text-brand-outline mt-1">
            {subtitle}
          </span>
        ) : null}
      </div>
      {setsReps ? (
        <div className="text-right shrink-0">
          <div className="font-display text-[2.5rem] md:text-[3rem] text-brand-primary leading-none tracking-tighter">
            {setsReps}
          </div>
        </div>
      ) : null}
    </div>
  );
}
