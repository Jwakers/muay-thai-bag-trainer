import React from 'react';

export function Button({ variant = 'primary', className = '', children, ...props }) {
  const baseStyles = "uppercase font-label tracking-wide transition-all duration-200 outline-none inline-flex justify-center items-center text-center font-bold font-label cursor-pointer";
  
  let variantStyles = "";
  if (variant === 'primary') {
    // The Glow: Primary gradient
    variantStyles = "bg-gradient-to-r from-brand-primary to-brand-primary-fixed-dim text-brand-on-primary hover:brightness-110 active:to-brand-primary px-[1.4rem] py-[1rem]";
  } else if (variant === 'secondary') {
    // Secondary: Outline ghost frame
    variantStyles = "border border-brand-outline-variant/20 text-brand-on-surface hover:bg-white/5 active:bg-white/10 px-[1.4rem] py-[1rem]";
  }

  return (
    <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  );
}
