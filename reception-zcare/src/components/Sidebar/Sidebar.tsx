import { useState } from 'react';
import {
  Stethoscope,
  FileText,
  Package,
  FlaskConical,
  Settings,
  Users,
  UserPlus,
  ChevronUp,
  ChevronDown,
  UserCheck,
  FileSpreadsheet,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ModuleTileData {
  icon: LucideIcon;
  title: string;
  isActive?: boolean;
  badge?: string;
}

interface MenuItemData {
  label: string;
  key: string;
}

interface AccordionSectionData {
  label: string;
  key: string;
  items: MenuItemData[];
}

const MODULE_TILES: ModuleTileData[] = [
  { icon: Stethoscope, title: 'Medical' },
  { icon: FileText, title: 'Records' },
  { icon: UserCheck, title: 'Front Office (Active)', isActive: true, badge: 'FO' },
  { icon: Package, title: 'Inventory' },
  { icon: FlaskConical, title: 'Lab' },
  { icon: Settings, title: 'Settings' },
  { icon: FileSpreadsheet, title: 'Billing' },
  { icon: Users, title: 'Staff' },
  { icon: UserPlus, title: 'New Patient' },
];

const ACCORDION_SECTIONS: AccordionSectionData[] = [
  {
    label: 'FO',
    key: 'fo',
    items: [
      { label: 'Registration', key: 'Registration' },
      { label: 'Appointment', key: 'Appointment' },
      { label: 'Kiosk Reporting (Service)', key: 'Kiosk Reporting (Service)' },
      { label: 'Kiosk Reporting (Pharmacy)', key: 'Kiosk Reporting (Pharmacy)' },
      { label: 'Kiosk Reporting (Doctor)', key: 'Kiosk Reporting (Doctor)' },
    ],
  },
  {
    label: 'Pharmacy Panel',
    key: 'pharmacy',
    items: [],
  },
];

function ModuleTile({ icon: Icon, title, isActive, badge }: ModuleTileData) {
  return (
    <button
      type="button"
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors relative ${
        isActive
          ? 'bg-[#05b875] text-white shadow-md shadow-emerald-900/30'
          : 'bg-[#12333f] hover:bg-[#1a4454] text-slate-300'
      }`}
      title={title}
    >
      <Icon className="w-4 h-4" />
      {badge && (
        <span className="absolute -bottom-1 -right-1 bg-[#04945d] text-[8px] font-black px-1 rounded-sm text-white">
          {badge}
        </span>
      )}
    </button>
  );
}

function SidebarMenuItem({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
        isActive
          ? 'border-[#05b875]/70 bg-[#0d343f] text-[#05b875] shadow-xs'
          : 'border-transparent text-slate-300 hover:text-white hover:bg-[#12333f]'
      }`}
    >
      {label}
    </button>
  );
}

export function Sidebar() {
  const [activeMenu, setActiveMenu] = useState('Registration');
  const [foOpen, setFoOpen] = useState(true);
  const [pharmacyOpen, setPharmacyOpen] = useState(false);

  const openStates: Record<string, boolean> = { fo: foOpen, pharmacy: pharmacyOpen };
  const setOpenStates: Record<string, (v: boolean) => void> = {
    fo: setFoOpen,
    pharmacy: setPharmacyOpen,
  };

  return (
    <aside className="w-64 bg-[#0a232c] h-full min-h-[calc(100vh-4rem)] text-slate-200 p-4 flex flex-col gap-6 shrink-0 border-r border-[#153844] overflow-y-auto">
      <div>
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
          MODULES
        </h2>
        <div className="grid grid-cols-4 gap-2">
          {MODULE_TILES.map((tile) => (
            <ModuleTile key={tile.title} {...tile} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        {ACCORDION_SECTIONS.map((section) => {
          const isOpen = openStates[section.key];
          const setIsOpen = setOpenStates[section.key];

          return (
            <div key={section.key}>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between font-bold text-sm text-slate-100 py-2 transition hover:text-emerald-400"
                aria-expanded={isOpen}
              >
                <span>{section.label}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {isOpen && section.items.length > 0 && (
                <div className="flex flex-col gap-1 mt-1 pl-1">
                  {section.items.map((item) => (
                    <SidebarMenuItem
                      key={item.key}
                      label={item.label}
                      isActive={activeMenu === item.key}
                      onClick={() => setActiveMenu(item.key)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default Sidebar;
