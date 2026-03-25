
export function PulseTimer({ time = "03:00", pulsing = false, warning = false }) {
  return (
    <div className="relative flex items-center justify-center py-[2.75rem] my-[2.75rem]">
      {pulsing && (
        <div
          className={`absolute inset-0 rounded-full animate-pulse pointer-events-none blur-[32px] opacity-60 ${warning ? 'border-brand-error' : 'border-brand-primary'}`}
          style={{
            background: `radial-gradient(circle at center, var(--color-brand-${warning ? 'error' : 'primary'}) 0%, transparent 60%)`
          }}
        ></div>
      )}
      <div className={`z-10 font-display text-[6rem] md:text-[8rem] tabular-nums tracking-tighter leading-none drop-shadow-lg transition-colors duration-500 line-clamp-1 ${warning ? 'text-brand-error' : 'text-brand-on-surface'}`}>
        {time}
      </div>
    </div>
  );
}
