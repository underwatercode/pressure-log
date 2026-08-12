import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export const THEMES = ['warm', 'meadow', 'night'] as const;
export type Theme = (typeof THEMES)[number];

export const THEME_LABELS: Record<Theme, string> = {
  warm: 'Warm',
  meadow: 'Meadow',
  night: 'Night',
};

const STORAGE_KEY = 'pressure-log:theme';
const DEFAULT_THEME: Theme = 'warm';

function isTheme(value: string | null): value is Theme {
  return value !== null && (THEMES as readonly string[]).includes(value);
}

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isTheme(stored) ? stored : DEFAULT_THEME;
  } catch {
    // localStorage can throw in private-browsing / storage-restricted contexts.
    return DEFAULT_THEME;
  }
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// Theme lives in localStorage for now. M2 moves it into the Dexie
// `settings` table alongside the rest of the app's preferences; this
// provider's public API (theme / setTheme) won't need to change then.
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readStoredTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore — theme still applies for this session even if it can't persist.
    }
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
