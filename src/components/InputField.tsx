import type { InputHTMLAttributes, ReactNode } from 'react';

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: ReactNode;
  className?: string;
}

export function InputField({ label, error, className = '', id, disabled, ...props }: InputFieldProps) {
  return (
    <div className={`flex flex-col mb-[1.4rem] ${className}`}>
      {label ? (
        <label
          htmlFor={id}
          className={`font-label text-[0.75rem] text-brand-outline mb-2 uppercase tracking-wide ${
            disabled ? 'opacity-60' : ''
          }`}
        >
          {label}
        </label>
      ) : null}
      <input
        id={id}
        disabled={disabled}
        className={`bg-transparent outline-none border-b-2 py-3 font-body text-[1rem] tabular-nums text-brand-on-surface transition-all
          ${
            error
              ? 'border-brand-error bg-brand-surface-container-lowest text-brand-error px-3'
              : 'border-brand-outline focus:border-brand-primary'
          }
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        {...props}
      />
      {error ? <span className="font-label text-[0.75rem] text-brand-error mt-2">{error}</span> : null}
    </div>
  );
}
