import type { ReactNode } from 'react';
import './Screen.css';

interface ScreenProps {
  title: string;
  children?: ReactNode;
}

// Shared per-tab chrome: heading style and content padding match the
// design bundle's screens (design/Pressure Log.dc.html), with
// safe-area-aware top padding standing in for the design canvas's fixed
// 58px (which only had to clear a mocked-up status bar, not a real one).
export function Screen({ title, children }: ScreenProps) {
  return (
    <div className="screen">
      <h1 className="screen-title">{title}</h1>
      {children}
    </div>
  );
}
