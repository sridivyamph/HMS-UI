import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
}

export function Input({
  label,
  required,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-slate-600">
          {label}
          {required && <span className="text-rose-500"> *</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-[#05b875] focus:ring-2 focus:ring-emerald-500/10 ${className}`}
        {...props}
      />
    </div>
  );
}
