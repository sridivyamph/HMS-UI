import React from 'react';
import { Bell, User, HeartHandshake, Menu, X } from 'lucide-react';

interface HeaderProps {
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ sidebarOpen, onToggleSidebar }) => {
  return (
    <header className="w-full bg-[#ecf5f1] border-b border-emerald-100/60 sticky top-0 z-30">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Left: Hamburger + Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-2">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-emerald-100/50 transition"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#05b875] flex items-center justify-center text-white shadow-sm">
              <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
            <span className="text-lg sm:text-2xl font-extrabold text-[#05b875] tracking-tight">Zcare</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          <a
            href="#lab-reports"
            className="hidden sm:inline text-sm font-semibold text-slate-700 hover:text-emerald-700 transition-colors"
          >
            Lab Reports
          </a>

          {/* Notification Bell */}
          <button
            type="button"
            className="relative p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-emerald-100/50 transition"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-1 right-1.5 sm:top-1.5 sm:right-1.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* Receptionist Profile Pill */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#dcf2e7] text-[#0b5c43] text-xs font-semibold shadow-xs">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#bce5d2] flex items-center justify-center">
              <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#0b5c43]" />
            </div>
            <span className="hidden sm:inline">Receptionist</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
