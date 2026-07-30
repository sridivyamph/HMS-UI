interface CheckboxPillProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export function CheckboxPill({ checked, onChange, label }: CheckboxPillProps) {
  return (
    <label
      className={`flex items-center gap-3 h-12 px-5 rounded-full border cursor-pointer transition-all select-none ${
        checked
          ? 'border-[#05b875] bg-[#effaf5]'
          : 'border-slate-200 bg-white hover:bg-[#effaf5]'
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded text-[#05b875] focus:ring-emerald-500 focus:ring-offset-0 w-4 h-4"
      />
      <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
        {label}
      </span>
    </label>
  );
}
