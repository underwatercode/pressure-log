import { House, List, TrendingUp, Heart, Settings as SettingsIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { TabId } from '../App';
import './TabBar.css';

const TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'log', label: 'Log', icon: List },
  { id: 'trends', label: 'Trends', icon: TrendingUp },
  { id: 'care', label: 'Care', icon: Heart },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

interface TabBarProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

// Bottom tab bar — height, blur, spacing, and colors match the design
// bundle's nav exactly (design/Pressure Log.dc.html, ~line 188).
export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav className="tab-bar" aria-label="Main">
      {TABS.map(({ id, label, icon: Icon }) => {
        const isActive = id === active;
        return (
          <button
            key={id}
            type="button"
            className="tab-bar-btn"
            aria-current={isActive ? 'page' : undefined}
            style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-neutral-500)' }}
            onClick={() => onChange(id)}
          >
            <Icon size={20} strokeWidth={2.75} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
