// M0 scaffold placeholder. The five-tab shell (Home / Log / Trends / Care /
// Settings) is built in M1 — this just confirms the build, fonts, and
// tokens are wired up correctly.
function App() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        textAlign: 'center',
        padding: 'var(--space-4)',
      }}
    >
      <h1>Pressure Log</h1>
      <p
        style={{
          margin: 0,
          maxWidth: 320,
          color: 'color-mix(in srgb, var(--color-text) 55%, transparent)',
        }}
      >
        Scaffold is up. The real app starts in M1.
      </p>
    </div>
  );
}

export default App;
