import { useState } from 'react';
import { ThemeProvider } from './theme/ThemeContext';
import { TabBar } from './components/TabBar';
import { Home } from './screens/Home';
import { Log } from './screens/Log';
import { Trends } from './screens/Trends';
import { Care } from './screens/Care';
import { Settings } from './screens/Settings';
import './App.css';

export type TabId = 'home' | 'log' | 'trends' | 'care' | 'settings';

const SCREENS: Record<TabId, () => React.JSX.Element> = {
  home: Home,
  log: Log,
  trends: Trends,
  care: Care,
  settings: Settings,
};

function Shell() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const ActiveScreen = SCREENS[activeTab];

  return (
    <div className="app-shell">
      <main className="app-content">
        <ActiveScreen />
      </main>
      <TabBar active={activeTab} onChange={setActiveTab} />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Shell />
    </ThemeProvider>
  );
}

export default App;
