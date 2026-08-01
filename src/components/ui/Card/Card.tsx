import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-sm border border-slate-100/80 overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}
