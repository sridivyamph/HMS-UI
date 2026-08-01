import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

const BASE = 'shrink-0 w-full sm:w-auto px-4 sm:px-5 py-2 text-sm font-semibold rounded-full transition-all active:scale-[0.98]';

const VARIANTS = {
  primary: 'bg-[#05b875] text-white hover:bg-[#049a5f]',
  secondary: 'bg-white text-slate-800 border border-slate-200/80 shadow-xs hover:bg-slate-50 hover:border-slate-300',
  ghost: 'text-[#05b875] hover:underline font-bold text-xs',
};

export function Button({
  variant = 'secondary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`${BASE} ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
