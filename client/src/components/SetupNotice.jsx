export default function SetupNotice() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#07060f', color: '#ecebff', fontFamily: 'Figtree, sans-serif' }}>
      <div style={{ maxWidth: 520, border: '1px solid rgba(255,255,255,.12)', borderRadius: 16, padding: 28, background: 'rgba(255,255,255,.04)' }}>
        <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 22, margin: '0 0 12px' }}>Clerk key missing</h1>
        <p style={{ color: '#a9a5cc', lineHeight: 1.6 }}>
          Create <code>client/.env</code> from <code>.env.example</code> and set <code>VITE_CLERK_PUBLISHABLE_KEY</code> to the publishable key from your Clerk dashboard. Then restart <code>npm run dev</code>.
        </p>
      </div>
    </main>
  );
}
