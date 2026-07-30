import { ChevronDown } from 'lucide-react';
import type { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  required?: boolean;
  options: readonly SelectOption[] | SelectOption[];
  placeholder?: string;
}

export function Select({
  label,
  required,
  options,
  placeholder = 'Select',
  className = '',
  id,
  ...props
}: SelectProps) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-xs font-medium text-slate-600">
          {label}
          {required && <span className="text-rose-500"> *</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`w-full appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-[#05b875] focus:ring-2 focus:ring-emerald-500/10 cursor-pointer pr-10 ${className}`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}
