import { Sun, Leaf, Moon, Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTheme, THEMES, THEME_LABELS } from '../theme/ThemeContext';
import type { Theme } from '../theme/ThemeContext';
import './ThemePicker.css';

const THEME_ICONS: Record<Theme, LucideIcon> = {
  warm: Sun,
  meadow: Leaf,
  night: Moon,
};

export function ThemePicker() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <div className="settings-group-label">Appearance</div>
      <div className="settings-group">
        {THEMES.map((id) => {
          const Icon = THEME_ICONS[id];
          const isActive = id === theme;
          return (
            <button
              key={id}
              type="button"
              className="settings-row"
              aria-pressed={isActive}
              onClick={() => setTheme(id)}
            >
              <Icon size={18} strokeWidth={2.25} color="var(--color-accent)" />
              <span className="settings-row-title">{THEME_LABELS[id]}</span>
              {isActive && <Check size={16} strokeWidth={3} color="var(--color-accent)" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
