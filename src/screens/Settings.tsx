import { Screen } from '../components/Screen';
import { ThemePicker } from '../components/ThemePicker';

export function Settings() {
  return (
    <Screen title="Settings">
      <ThemePicker />
      <p className="screen-note" style={{ marginTop: 'var(--space-4)' }}>
        Naming the bunny, reminders, doctor export, and backup land here in a later milestone.
      </p>
    </Screen>
  );
}
