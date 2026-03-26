import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  className?: string;
  children?: ReactNode;
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseStyles =
    'uppercase font-label tracking-wide transition-all duration-200 outline-none inline-flex justify-center items-center text-center font-bold font-label cursor-pointer';

  let variantStyles = '';
  if (variant === 'primary') {
    variantStyles =
      'bg-gradient-to-r from-brand-primary to-brand-primary-fixed-dim text-brand-on-primary hover:brightness-110 active:to-brand-primary px-standard py-4';
  } else if (variant === 'secondary') {
    variantStyles =
      'border border-brand-outline-variant/20 text-brand-on-surface hover:bg-white/5 active:bg-white/10 px-standard py-4';
  }

  return (
    <button type={type} className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  );
}
