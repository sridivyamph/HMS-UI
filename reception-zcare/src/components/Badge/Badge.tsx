import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
}

export function Badge({ children }: BadgeProps) {
  return (
    <span className="px-2.5 py-0.5 rounded-md bg-[#e3f6ed] text-[#058a58] text-[10px] font-extrabold tracking-wider uppercase">
      {children}
    </span>
  );
}
